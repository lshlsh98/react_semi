import MyBoardItem from "./MyBoardItem";
import styles from "./MyBoardList.module.css";

const MyBoardList = ({ boardList, setBoardList, status }) => {
  return (
    <div className={styles.myboard_list_wrap}>
      {boardList.map((board, index) => (
        <MyBoardItem
          key={board.boardNo}
          board={board}
          index={index}
          boardList={boardList}
          setBoardList={setBoardList}
          status={status}
        />
      ))}
    </div>
  );
};

export default MyBoardList;
