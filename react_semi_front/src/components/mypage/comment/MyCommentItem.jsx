import useAuthStore from "../../utils/useAuthStore";
import styles from "./MyCommentItem.module.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReportIcon from "@mui/icons-material/Report";
import { TextArea } from "../../ui/Form";
import { useEffect, useRef, useState } from "react";

const MyCommentItem = () => {
  const { memberId, memberThumb } = useAuthStore();
  const [comment, setComment] = useState(
    "일출 사진들이 멋지네요 ^%^ 같은장소 맞나요 ㅎ 뛸 때는 정신없어서 잘모르는데, 나중에 사진으로 보니까 더 그럴싸해보이네요\n\n\n",
  );

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 초기화
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // 내용만큼 늘리기
    }
  }, [comment]); // comment 바뀔 때마다 실행

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
            <div className={styles.comment_name}>Ruy Lopez</div>
            <div className={styles.comment_type}>커뮤니티</div>
          </div>
        </div>
        <div className={styles.comment_content}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={true}
          />
        </div>
        <div className={styles.comment_actions}>
          <div>
            <ThumbUpIcon /> 3
          </div>
          <div>
            <ThumbDownIcon /> 1
          </div>
          <div className={styles.comment_actions_report}>
            <ReportIcon /> 1
          </div>
        </div>
      </div>
      <div className={styles.comment_btn_section}>
        <div className={styles.comment_btn}>수정</div>
        <div className={styles.comment_btn}>삭제</div>
      </div>
    </div>
  );
};

export default MyCommentItem;
