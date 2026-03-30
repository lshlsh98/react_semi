import styles from "./MyBoardList.module.css";
import AdminBoardItem from "./AdminBoardItem";

const AdminBoardList = () => {
  return (
    <div className={styles.myboard_list_wrap}>
      <AdminBoardItem />
    </div>
  );
};

export default AdminBoardList;
