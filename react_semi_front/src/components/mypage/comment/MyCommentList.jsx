import MyCommentItem from "./MyCommentItem";
import styles from "./MyCommentList.module.css";

const MyCommentList = () => {
  return (
    <div className={styles.mycomment_list_wrap}>
      <MyCommentItem />
      <MyCommentItem />
      <MyCommentItem />
      <MyCommentItem />
      <MyCommentItem />
      <MyCommentItem />
      <MyCommentItem />
      <MyCommentItem />
      <MyCommentItem />
      <MyCommentItem />
    </div>
  );
};

export default MyCommentList;
