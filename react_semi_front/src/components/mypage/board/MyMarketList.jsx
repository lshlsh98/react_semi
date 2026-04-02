import MyMarketItem from "./MyMarketItem";

const MyMarketList = ({ boardList, setBoardList, status }) => {
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
        />
      ))}
    </div>
  );
};

export default MyMarketList;
