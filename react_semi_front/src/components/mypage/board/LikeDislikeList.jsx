import MyMarketItem from "./MyMarketItem";
import MyBoardItem from "./MyBoardItem";

const LikeDislikeList = ({ boardList }) => {
  return (
    <div>
      {boardList.map((board) => {
        return board.boardType === "market" ? (
          <MyMarketItem
            key={`${board.boardType}-${board.boardNo}`}
            board={board}
            isAdminMode={"false"}
          />
        ) : (
          <MyBoardItem
            key={`${board.boardType}-${board.boardNo}`}
            board={board}
            isAdminMode={"false"}
          />
        );
      })}
    </div>
  );
};

export default LikeDislikeList;
