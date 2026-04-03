import { useNavigate, useParams } from "react-router-dom";
import styles from "./Community.module.css";
import { useEffect, useState } from "react";
import useAuthStore from "../../components/utils/useAuthStore";
import axios from "axios";
import Swal from "sweetalert2";

const CommunityViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const communityNo = params.communityNo;
  const { memberId, isReady } = useAuthStore();
  const [community, setCommunity] = useState(null);
  console.log(isReady, "isReady 확인");
  useEffect(() => {
    if (!isReady) {
      return;
    }
    axios
      .get(`${import.meta.env_VITE_BACKSERVER}/communties/${communityNo}`)
      .then((res) => {
        console.log(res);
        setCommunity(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isReady]);

  const deleteCommunity = () => {
    Swal.fire({
      title: "게시글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}`,
          )
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              navigate("/community/list");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <section className={styles.community_wrap}>
      <h2>커뮤니티 상세보기</h2>
      {community && (
        <>
          <div className={styles.community_view_wrap}>
            <div className={styles.community_view_header}>
              <h2 className={styles.community_title}>
                {community.communityTitle}
              </h2>
              <div className={styles.community_sub_info}>
                <div className={styles.community_writer}>
                  <span>{community.communityWriter}</span>
                </div>
                <div className={styles.community_date}>
                  {community.communityDate}
                </div>
              </div>
              <div className={styles.community_view_count}>
                {community.communityViewCount}
              </div>
            </div>
            <div
              className={styles.community_view_content}
              dangerouslySetInnerHTML={{ __html: community.communityContent }}
            ></div>
          </div>

          <div className={styles.community_action_wrap}>
            {memberId && memberId === community.communityWriter && (
              <div>
                <Button
                  className="btn primary"
                  onClick={() => {
                    navigate(`/community/modify/${community.communityNo}`);
                  }}
                >
                  수정
                </Button>
                <Button
                  className="btn primary outline"
                  onClick={deleteCommunity}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );

  const registComment = () => {
    if (communityComment.communityCommentContent === "") {
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/communities/comments`,
        communityComment,
      )
      .then((res) => {
        console.log(res);
        setCommunityCommentList([...communityCommentList, res.data]);
        setCommunityComment({
          ...communityComment,
          CommunityCommentContent: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.comment_wrap}>
      {memberId && (
        <div className={styles.comment_regist_wrap}>
          <h3>댓글 등록</h3>
          <div className={styles.input_item}>
            <TextArea
              value={communityComment.communityCommentContent}
              onChange={(e) => {
                setCommunityComment({
                  ...communityComment,
                  communityCommentContent: e.target.value,
                });
              }}
            ></TextArea>
            <Button className="btn primary" onClick={registComment}>
              등록
            </Button>
          </div>
        </div>
      )}
      <div className={styles.comment_list_wrap}>
        {communityCommentList.map((comment, index) => {
          return (
            <CommunityComment
              key={"comment-" + comment.communityCommentNo}
              comment={comment}
              index={index}
              updateComment={updateComment}
              deleteComment={deleteComment}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CommunityViewPage;
