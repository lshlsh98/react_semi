import MyBoardItem from "./MyBoardItem";
import styles from "./MyBoardList.module.css";

const MyBoardList = () => {
  return (
    <div className={styles.myboard_list_wrap}>
      <MyBoardItem />
      <MyBoardItem />
      <MyBoardItem />
      <MyBoardItem />
      <MyBoardItem />
      <MyBoardItem />
      <MyBoardItem />
      <MyBoardItem />
      <MyBoardItem />
      <MyBoardItem />
    </div>
  );
};

export default MyBoardList;
