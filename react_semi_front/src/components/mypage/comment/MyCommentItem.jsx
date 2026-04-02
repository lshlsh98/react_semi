import useAuthStore from "../../utils/useAuthStore";
import styles from "./MyCommentItem.module.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReportIcon from "@mui/icons-material/Report";
import { TextArea } from "../../ui/Form";
import { useEffect, useRef, useState } from "react";

const MyCommentItem = ({ comment, index, commentList, setCommentList }) => {
  const memberThumb = comment.writerThumb;

  const memberGrade = useAuthStore((state) => state.memberGrade);
  const [curComment, setCurComment] = useState(comment.commentContent);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 초기화
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // 내용만큼 늘리기
    }
  }, [curComment]); // comment 바뀔 때마다 실행

  return (
    <div className={styles.item_wrap}>
      <div className={styles.comment_wrap}>
        <div className={styles.comment_writer}>
          <div className={styles.comment_wrtier_thumb}>
            <div
              className={
                memberThumb ? styles.member_thumb_exists : styles.member_thumb
              }
            >
              {memberThumb ? (
                <img
                  src={`${import.meta.env.VITE_BACKSERVER}/member/thumb/${memberThumb}`}
                />
              ) : (
                <span className="material-icons">account_circle</span>
              )}
            </div>
          </div>
          <div className={styles.comment_writer_info}>
            <div
              className={styles.comment_name}
            >{`${comment.writerName} [${comment.writerId}]`}</div>
          </div>
        </div>
        <div className={styles.comment_content}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={curComment}
            onChange={(e) => setCurComment(e.target.value)}
            disabled={true}
          />
        </div>
        <div className={styles.comment_actions}>
          <Actions comment={comment} />
        </div>
      </div>
      <div className={styles.comment_btn_section}>
        <div className={styles.comment_btn}>수정</div>
        <div className={styles.comment_btn}>삭제</div>
      </div>
    </div>
  );
};

const Actions = ({ comment }) => {
  return (
    <>
      <div
        className={`${styles.item_actions_report} ${comment.isReported === 1 ? styles.isReported : styles.action_default}`}
      >
        <ReportIcon />
        <div>{comment.reportCount}</div>
      </div>
    </>
  );
};

export default MyCommentItem;
