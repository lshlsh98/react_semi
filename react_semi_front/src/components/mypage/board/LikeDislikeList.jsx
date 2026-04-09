import MyMarketItem from "./MyMarketItem";
import MyBoardItem from "./MyBoardItem";

const LikeDislikeList = ({ boardList }) => {
  return (
    <div>
      {/* 게시글 타입에 맞는 Item 컴포넌트로 랜더링 */}
      {boardList.map((board) => {
        return board.boardType === "market" ? (
          <MyMarketItem // 거래 게시글
            key={`${board.boardType}-${board.boardNo}`}
            board={board}
            isAdminMode={"false"} // true->관리 / false->일반
          />
        ) : (
          <MyBoardItem // 커뮤니티 게시글
            key={`${board.boardType}-${board.boardNo}`}
            board={board}
            isAdminMode={"false"} // true->관리 / false->일반
          />
        );
      })}
    </div>
  );
};

export default LikeDislikeList;
