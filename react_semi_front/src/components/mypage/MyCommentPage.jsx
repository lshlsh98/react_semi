import MyCommentList from "./comment/MyCommentList";
import styles from "./MyCommentPage.module.css";

const MyCommentPage = () => {
  return (
    <div className={styles.mycomment_wrap}>
      <div className={styles.filter_section}></div>
      <div className={styles.mycomment_list_content}>
        <MyCommentList />
      </div>
      <div className={styles.pagination_section}></div>
    </div>
  );
};

export default MyCommentPage;
