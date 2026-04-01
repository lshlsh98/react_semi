import MyBoardItem from "./MyBoardItem";
import styles from "./MyBoardList.module.css";

const MyBoardList = ({ boardList, setBoardList }) => {
  return (
    <div className={styles.myboard_list_wrap}>
      {boardList.map((board, index) => (
        <MyBoardItem
          key={board.boardNo}
          board={board}
          index={index}
          boardList={boardList}
          setBoardList={setBoardList}
        />
      ))}
    </div>
  );
};

export default MyBoardList;
