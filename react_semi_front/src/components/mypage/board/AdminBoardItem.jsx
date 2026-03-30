import styles from "./MyBoardItem.module.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CommentIcon from "@mui/icons-material/Comment";
import ReportIcon from "@mui/icons-material/Report";

const AdminBoardItem = () => {
  return (
    <div className={styles.item_wrap}>
      <div className={styles.item_title}>
        오늘은 앱 인터벌 트레이닝 켜서 걷뛰로 가볍게 돌았습니다
      </div>
      <div className={styles.item_info}>
        <div>욤욤이</div>
        <div>3시간 전</div>
        <div>커뮤니티</div>
      </div>
      <div className={styles.item_actions}>
        <div>
          <ThumbUpIcon /> 3
        </div>
        <div>
          <ThumbDownIcon /> 1
        </div>
        <div>
          <CommentIcon /> 20
        </div>
        <div className={styles.item_actions_report}>
          <ReportIcon /> 1
        </div>
      </div>
    </div>
  );
};

export default AdminBoardItem;
