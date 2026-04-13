import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./CommunityComment.module.css";
import Button from "../ui/Button";
import Swal from "sweetalert2";
import useAuthStore from "../utils/useAuthStore";
import Pagination from "../../components/ui/Pagination";
import BasicSelect from "../../components/ui/BasicSelect";

const timeAgo = (dateString) => {
  if (!dateString) return "";
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return "방금 전";
  else if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)}분 전`;
  else if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  else if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  else return dateString.split(" ")[0];
};

const CommunityComment = ({ communityNo, memberId, communityWriter }) => {
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [orderType, setOrderType] = useState("newest"); // 비밀댓글이 없으니 필터는 빼고 정렬만 유지!

  const orderList = [
    ["newest", "최신순"],
    ["oldest", "오래된순"],
  ];

  const handleOrderChange = (value) => {
    setOrderType(value);
    setPage(0);
    scrollToCommentTop();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    scrollToCommentTop();
  };

  const { memberThumb } = useAuthStore();
  const commentWrapRef = useRef(null);

  const scrollToCommentTop = () => {
    if (commentWrapRef.current) {
      const headerOffset = 148;
      const elementPosition =
        commentWrapRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const fetchComments = () => {
    if (!communityNo) return;

    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/comments?page=${page}&orderType=${orderType}`,
      )
      .then((res) => {
        setCommentList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => console.log("댓글 로딩 실패:", err));
  };

  useEffect(() => {
    fetchComments();
  }, [communityNo, page, orderType]);

  const submitComment = () => {
    if (!memberId) {
      Swal.fire({
        icon: "warning",
        title: "로그인 필요",
        text: "로그인 후 이용해주세요.",
      });
      return;
    }
    if (newComment.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "댓글 내용을 입력해주세요.",
      });
      return;
    }

    const commentData = {
      communityNo: communityNo,
      communityCommentWriter: memberId,
      communityCommentContent: newComment,
      communityRecommentNo: null,
    };

    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/communities/comments`,
        commentData,
      )
      .then(() => {
        setNewComment("");
        setPage(0);
        setOrderType("newest");
        fetchComments();
        scrollToCommentTop();
      })
      .catch((err) => console.log("댓글 작성 실패:", err));
  };

  const renderComments = (parentId) => {
    return commentList
      .filter((c) => c.communityRecommentNo === parentId)
      .map((comment) => (
        <CommentItem
          key={comment.communityCommentNo}
          comment={comment}
          memberId={memberId}
          communityWriter={communityWriter}
          fetchComments={fetchComments}
          allComments={commentList}
          communityNo={communityNo}
          memberThumb={memberThumb}
        />
      ));
  };

  return (
    <div className={styles.comment_wrap} ref={commentWrapRef}>
      <div className={styles.comment_header_wrap}>
        <h4 className={styles.comment_title}>댓글</h4>
        <div className={styles.filter_wrap}>
          <BasicSelect
            state={orderType}
            setState={handleOrderChange}
            list={orderList}
          />
        </div>
      </div>

      <ul className={styles.comment_list}>{renderComments(null)}</ul>

      <div className={styles.comment_write_wrap}>
        <div className={styles.write_header}>
          {memberId && memberThumb ? (
            <img
              src={`${import.meta.env.VITE_BACKSERVER}/semi/${memberThumb}`}
              alt="프사"
            />
          ) : (
            <span className="material-icons">account_circle</span>
          )}
          <span>{memberId ? memberId : "비회원"}</span>
        </div>

        <textarea
          className={styles.comment_textarea}
          placeholder={
            memberId
              ? "댓글을 남겨보세요."
              : "로그인 후 댓글을 작성할 수 있습니다."
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!memberId}
          maxLength={1000}
        />

        <div className={styles.write_footer}>
          {/* 비밀댓글 체크박스 있던 자리 비워둠 (레이아웃 유지를 위해 우측 정렬 속성만 변경) */}
          <div style={{ flex: 1 }}></div>
          <div className={styles.write_actions}>
            <span
              className={styles.char_counter}
              style={{
                color:
                  newComment.length >= 1000 ? "var(--danger)" : "var(--gray4)",
              }}
            >
              {newComment.length}/1000
            </span>
            <Button
              className="btn primary sm"
              onClick={submitComment}
              disabled={!memberId}
            >
              등록
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.pagination_area}>
        <Pagination
          page={page}
          setPage={handlePageChange}
          totalPage={totalPage}
          naviSize={5}
        />
      </div>
    </div>
  );
};

// --- 개별 댓글 아이템 ---
const CommentItem = ({
  comment,
  memberId,
  fetchComments,
  allComments,
  communityNo,
  memberThumb,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(
    comment.communityCommentContent,
  );
  const [showReplies, setShowReplies] = useState(false);

  const isMyComment = memberId === comment.communityCommentWriter;

  const childComments = allComments.filter(
    (c) => c.communityRecommentNo === comment.communityCommentNo,
  );

  const deleteComment = () => {
    Swal.fire({
      title: "댓글 삭제",
      text: "삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/communities/comments/${comment.communityCommentNo}`,
          )
          .then(fetchComments)
          .catch(console.log);
      }
    });
  };

  const updateComment = () => {
    if (
      editContent.trim() === "" ||
      editContent === comment.communityCommentContent
    )
      return;
    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/communities/comments`, {
        communityCommentNo: comment.communityCommentNo,
        communityCommentContent: editContent,
      })
      .then(() => {
        setIsEditing(false);
        fetchComments();
      })
      .catch(console.log);
  };

  const submitReply = () => {
    if (replyContent.trim() === "") return;
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/communities/comments`, {
        communityNo: communityNo,
        communityCommentWriter: memberId,
        communityCommentContent: replyContent,
        communityRecommentNo: comment.communityCommentNo,
      })
      .then(() => {
        setReplyContent("");
        setShowReplyInput(false);
        setShowReplies(true);
        fetchComments();
      })
      .catch(console.log);
  };

  const reportComment = () => {
    /* ... 마켓 신고 로직과 100% 동일 (API 주소만 변경) ... */
  };

  // 🚀 좋아요 / 싫어요 처리 함수 (백엔드와 연결 필요)
  const handleLike = () => {
    if (!memberId) return Swal.fire({ icon: "warning", title: "로그인 필요" });
    console.log("좋아요 클릭!", comment.communityCommentNo);
  };

  const handleDislike = () => {
    if (!memberId) return Swal.fire({ icon: "warning", title: "로그인 필요" });
    console.log("싫어요 클릭!", comment.communityCommentNo);
  };

  return (
    <li className={styles.comment_item}>
      <div className={styles.comment_header}>
        <div className={styles.writer_info}>
          {comment.memberThumb ? (
            <img
              src={`${import.meta.env.VITE_BACKSERVER}/semi/${comment.memberThumb}`}
              alt="프사"
            />
          ) : (
            <span className="material-icons">account_circle</span>
          )}
          <span className={styles.writer_id}>
            {comment.communityCommentWriter}
          </span>
          <span className={styles.comment_date}>
            {timeAgo(comment.communityCommentDate)}
            {comment.isEdited === 1 && (
              <span className={styles.edited_mark}>(수정됨)</span>
            )}
          </span>
        </div>

        {isMyComment && !isEditing && (
          <div className={styles.comment_actions}>
            <button onClick={() => setIsEditing(true)}>수정</button>
            <button onClick={deleteComment}>삭제</button>
          </div>
        )}
      </div>

      <div className={styles.comment_content}>
        {isEditing ? (
          <div className={styles.edit_wrap}>
            <textarea
              className={styles.comment_textarea}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={1000}
            />
            <div className={styles.write_footer}>
              <div style={{ flex: 1 }}></div>
              <div className={styles.write_actions}>
                <span className={styles.char_counter}>
                  {editContent.length}/1000
                </span>
                <div className={styles.btn_group}>
                  <Button
                    className="btn sm"
                    onClick={() => setIsEditing(false)}
                  >
                    취소
                  </Button>
                  <Button className="btn primary sm" onClick={updateComment}>
                    완료
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>{comment.communityCommentContent}</p>
        )}
      </div>

      {/* 🚀 커뮤니티 전용: 좋아요/싫어요, 답글, 신고 영역 */}
      {!isEditing && (
        <div className={styles.comment_footer}>
          {/* 좋아요 / 싫어요 래퍼 */}
          <div className={styles.like_dislike_wrap}>
            <button onClick={handleLike} className={styles.reaction_btn}>
              <span className="material-icons">thumb_up</span>
              <span>{comment.likeCount || 0}</span>
            </button>
            <button onClick={handleDislike} className={styles.reaction_btn}>
              <span className="material-icons">thumb_down</span>
              <span>{comment.dislikeCount || 0}</span>
            </button>
          </div>

          <div className={styles.footer_actions}>
            {memberId && (
              <button onClick={() => setShowReplyInput(!showReplyInput)}>
                {showReplyInput ? "답글취소" : "답글달기"}
              </button>
            )}
            {!isMyComment && (
              <button className={styles.report_btn} onClick={reportComment}>
                신고
              </button>
            )}
          </div>
        </div>
      )}

      {/* 답글 입력창 */}
      {showReplyInput && (
        <div className={styles.reply_write_wrap}>
          <div className={styles.comment_write_wrap}>
            <div className={styles.write_header}>
              <span className={`material-icons ${styles.reply_arrow_icon}`}>
                subdirectory_arrow_right
              </span>
              {memberThumb ? (
                <img
                  src={`${import.meta.env.VITE_BACKSERVER}/semi/${memberThumb}`}
                  alt="프사"
                  className={styles.reply_profile_img}
                />
              ) : (
                <span className="material-icons">account_circle</span>
              )}
              <span>{memberId ? memberId : "비회원"}</span>
            </div>
            <textarea
              className={styles.comment_textarea}
              placeholder="답글을 남겨보세요."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              maxLength={1000}
            />
            <div className={styles.write_footer}>
              <div style={{ flex: 1 }}></div>
              <div className={styles.write_actions}>
                <span className={styles.char_counter}>
                  {replyContent.length}/1000
                </span>
                <Button className="btn primary sm" onClick={submitReply}>
                  등록
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 답글 보기 토글 & 리스트 */}
      {childComments.length > 0 && (
        <button
          className={styles.toggle_replies_btn}
          onClick={() => setShowReplies(!showReplies)}
        >
          <span className="material-icons">
            {showReplies ? "expand_less" : "expand_more"}
          </span>
          <span className={styles.toggle_text}>
            {showReplies
              ? "답글 숨기기"
              : `답글 ${childComments.length}개 보기`}
          </span>
        </button>
      )}

      {showReplies && (
        <ul className={styles.reply_list}>
          {childComments.map((child) => (
            <CommentItem
              key={child.communityCommentNo}
              comment={child}
              memberId={memberId}
              fetchComments={fetchComments}
              allComments={allComments}
              communityNo={communityNo}
              memberThumb={memberThumb}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default CommunityComment;
