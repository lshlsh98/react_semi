import MyBoardItem from "./MyBoardItem";

const MyBoardList = ({ boardList, setBoardList, status, isAdminMode }) => {
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
          isAdminMode={isAdminMode}
        />
      ))}
    </div>
  );
};

export default MyBoardList;
