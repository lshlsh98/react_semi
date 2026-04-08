import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MarketComment.module.css";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";

const MarketComment = ({ marketNo, memberId }) => {
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSecret, setIsSecret] = useState(false); // 비밀댓글 여부

  // 댓글 목록 불러오기
  const fetchComments = () => {
    // 💡 방어 로직: marketNo가 확실히 있을 때만 요청
    if (!marketNo) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/comments`)
      .then((res) => {
        setCommentList(res.data);
      })
      .catch((err) => console.log("댓글 로딩 실패:", err));
  };

  useEffect(() => {
    fetchComments();
  }, [marketNo]);

  // 새 댓글 작성
  const submitComment = () => {
    // 💡 방어 로직 추가
    if (!marketNo) {
      Swal.fire("오류", "게시글 정보를 확인할 수 없습니다.", "error");
      return;
    }
    if (newComment.trim() === "") {
      Swal.fire("입력 오류", "댓글 내용을 입력해주세요.", "warning");
      return;
    }

    const commentData = {
      marketNo: marketNo,
      memberId: memberId,
      marketCommentContent: newComment,
      isSecret: isSecret ? 1 : 0,
      marketCommentRef: null, // 최상위 댓글이므로 null
    };

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/markets/comments`, commentData)
      .then((res) => {
        setNewComment("");
        setIsSecret(false);
        fetchComments(); // 작성 후 목록 새로고침
      })
      .catch((err) => console.log("댓글 작성 실패:", err));
  };

  // 대댓글 렌더링 함수 (재귀)
  const renderComments = (parentId) => {
    return commentList
      .filter((c) => c.marketCommentRef === parentId)
      .map((comment) => (
        <CommentItem
          key={comment.marketCommentNo}
          comment={comment}
          memberId={memberId}
          fetchComments={fetchComments} // 삭제/수정 후 새로고침을 위해 넘김
          allComments={commentList} // 자식 대댓글을 찾기 위해 전체 리스트 넘김
        />
      ));
  };

  return (
    <div className={styles.comment_wrap}>
      <h4 className={styles.comment_title}>댓글</h4>

      {/* 댓글 리스트 출력 */}
      <ul className={styles.comment_list}>
        {renderComments(null)} {/* 최상위 댓글부터 시작 */}
      </ul>

      {/* 댓글 작성 영역 */}
      <div className={styles.comment_write_wrap}>
        <div className={styles.write_header}>
          <span className="material-icons">account_circle</span>
          <span>{memberId ? memberId : "비회원"}</span>
        </div>
        <textarea
          className={styles.comment_textarea}
          placeholder="댓글을 남겨보세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className={styles.write_footer}>
          <label className={styles.secret_check}>
            <input
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
            />
            비밀댓글
          </label>
          <Button className="btn primary sm" onClick={submitComment}>
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

// 개별 댓글 아이템 컴포넌트
const CommentItem = ({ comment, memberId, fetchComments, allComments }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSecretReply, setIsSecretReply] = useState(false);

  // 대댓글 작성 로직
  const submitReply = () => {
    // ... (위의 submitComment와 유사하되 marketCommentRef에 comment.marketCommentNo 할당)
  };

  const deleteComment = () => {
    // 삭제 axios 통신 로직...
  };

  return (
    <li className={styles.comment_item}>
      <div className={styles.comment_header}>
        <div className={styles.writer_info}>
          {comment.memberThumb ? (
            <img src={comment.memberThumb} alt="프사" />
          ) : (
            <span className="material-icons">account_circle</span>
          )}
          <span className={styles.writer_id}>{comment.memberId}</span>
          <span className={styles.comment_date}>
            {comment.marketCommentDate}
          </span>
        </div>
        {/* 수정/삭제 버튼 (내가 쓴 글일 때만) */}
        {memberId === comment.memberId && (
          <div className={styles.comment_actions}>
            <button>수정</button>
            <button onClick={deleteComment}>삭제</button>
          </div>
        )}
      </div>

      {/* 비밀댓글 처리 로직 */}
      <div className={styles.comment_content}>
        {comment.isSecret === 1 ? (
          <span className={styles.secret_text}>🔒 비밀댓글입니다.</span>
        ) : (
          // 💡 실제로는 글 작성자거나 댓글 작성자 본인일 경우 내용 보여주는 로직 추가 필요
          <p>{comment.marketCommentContent}</p>
        )}
      </div>

      <div className={styles.comment_footer}>
        <button onClick={() => setShowReplyInput(!showReplyInput)}>
          답글달기
        </button>
        <button className={styles.report_btn}>신고</button>
      </div>

      {/* 대댓글 입력창 */}
      {showReplyInput && (
        <div className={styles.reply_write_wrap}>
          {/* ... 대댓글 입력 폼 ... */}
        </div>
      )}

      {/* 자식 대댓글 렌더링 (재귀 호출) */}
      <ul className={styles.reply_list}>
        {allComments
          .filter((c) => c.marketCommentRef === comment.marketCommentNo)
          .map((childComment) => (
            <CommentItem
              key={childComment.marketCommentNo}
              comment={childComment}
              memberId={memberId}
              fetchComments={fetchComments}
              allComments={allComments}
            />
          ))}
      </ul>
    </li>
  );
};

export default MarketComment;
