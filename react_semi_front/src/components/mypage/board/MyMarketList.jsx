import MyMarketItem from "./MyMarketItem";

const MyMarketList = ({ boardList, setBoardList, status, isAdminMode }) => {
  return (
    <div>
      {boardList.map((board, index) => (
        <MyMarketItem
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

export default MyMarketList;
