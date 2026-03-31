import useAuthStore from "../../utils/useAuthStore";
import styles from "./MyCommentItem.module.css";

const MyCommentItem = () => {
  const { memberId, memberThumb } = useAuthStore();

  return (
    <div className={styles.item_wrap}>
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
    </div>
  );
};

export default MyCommentItem;
