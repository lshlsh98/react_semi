package kr.co.iei.mypage.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.mypage.model.vo.BoardListRequestDto;
import kr.co.iei.mypage.model.vo.BoardSummary;
import kr.co.iei.mypage.model.vo.CommentSummary;
import kr.co.iei.mypage.model.vo.UpdateDto;

@Mapper
public interface MypageDao {

	List<BoardSummary> findCommunityAll(BoardListRequestDto request);

	int findCommunityCount(BoardListRequestDto request);

	int updateCommunityStatus(UpdateDto update);

	int deleteCommunity(int boardNo);

	List<BoardSummary> findMarketAll(BoardListRequestDto request);

	int findMarketAllCount(BoardListRequestDto request);

	int updateMarketStatus(UpdateDto update);

	int deleteMarket(int boardNo);

	List<CommentSummary> findMarketCommentAll(BoardListRequestDto request);

	int findMarketCommentAllCount(BoardListRequestDto request);
}
