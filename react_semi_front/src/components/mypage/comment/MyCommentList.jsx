import MyCommentItem from "./MyCommentItem";
import styles from "./MyCommentList.module.css";

const MyCommentList = () => {
  return (
    <div className={styles.mycomment_list_wrap}>
      <MyCommentItem />
    </div>
  );
};

export default MyCommentList;
