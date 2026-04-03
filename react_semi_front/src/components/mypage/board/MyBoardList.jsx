import MyBoardItem from "./MyBoardItem";

const MyBoardList = ({ boardList, setBoardList, status }) => {
  boardList.map((b) => {
    console.log(b.boardNo);
  });
  return (
    <div>
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
