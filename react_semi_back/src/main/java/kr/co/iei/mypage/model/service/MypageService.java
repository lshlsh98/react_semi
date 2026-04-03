package kr.co.iei.mypage.model.service;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.mypage.model.dao.MypageDao;
import kr.co.iei.mypage.model.vo.BoardListRequestDto;
import kr.co.iei.mypage.model.vo.BoardSummary;
import kr.co.iei.mypage.model.vo.CommentSummary;
import kr.co.iei.mypage.model.vo.UpdateCommentDto;
import kr.co.iei.mypage.model.vo.UpdateDto;

@Service
public class MypageService {
	
	@Autowired 
	private MypageDao mypageDao;

	public List<BoardSummary> findCommunityAll(BoardListRequestDto request) {
		List<BoardSummary> list = mypageDao.findCommunityAll(request);
		
		return list;
	}//

	public int findCommunityCount(BoardListRequestDto request) {
		int count = mypageDao.findCommunityCount(request);
		
		return count;
	}//

	@Transactional
	public int updateCommunityStatus(UpdateDto update) {
		int result = mypageDao.updateCommunityStatus(update);
		
		return result;
	}//

	@Transactional
	public int deleteCommunity(int boardNo) {
		int result = mypageDao.deleteCommunity(boardNo);
		
		return result;
	}//

	public List<BoardSummary> findMarketAll(BoardListRequestDto request) {
		List<BoardSummary> list = mypageDao.findMarketAll(request);
		
		return list;
	}//

	public int findMarketAllCount(BoardListRequestDto request) {
		int count = mypageDao.findMarketAllCount(request);
		
		return count;
	}//

	@Transactional
	public int updateMarketStatus(UpdateDto update) {
		int result = mypageDao.updateMarketStatus(update);
		
		return result;
	}//

	@Transactional
	public int deleteMarket(int boardNo) {
		int result = mypageDao.deleteMarket(boardNo);
		
		return result;
	}//

	public List<CommentSummary> findMarketCommentAll(BoardListRequestDto request) {
		List<CommentSummary> list = mypageDao.findMarketCommentAll(request);
		
		return list;
	}//

	public int findMarketCommentAllCount(BoardListRequestDto request) {
		int count = mypageDao.findMarketCommentAllCount(request);
		
		return count;
	}//

	@Transactional
	public int updateComment(UpdateCommentDto update) {
		if(Objects.equals(update.getType(), "market")) {
			return mypageDao.updateMarketComment(update);
		} else if (Objects.equals(update.getType(), "community")) {
			return mypageDao.updateCommunityComment(update);
		}
		 
		return -1;
	}//

	@Transactional
	public int deleteComment(UpdateCommentDto delete) {
		if(Objects.equals(delete.getType(), "market")) {
			return mypageDao.deleteMarketComment(delete);
		} else if (Objects.equals(delete.getType(), "community")) {
			return mypageDao.deleteCommunityComment(delete);
		}
		 
		return -1;
	}//

	public List<CommentSummary> findCommunityCommentAll(BoardListRequestDto request) {
		List<CommentSummary> list = mypageDao.findCommunityCommentAll(request);
		
		return list;
	}//

	public int findCommunityCommentAllCount(BoardListRequestDto request) {
		int count = mypageDao.findCommunityCommentAllCount(request);
		
		return count;
	}//

}





















