package kr.co.iei.mypage.model.service;

import java.util.List;

import org.apache.ibatis.annotations.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.mypage.model.dao.MypageDao;
import kr.co.iei.mypage.model.vo.CommunityListRequestDto;
import kr.co.iei.mypage.model.vo.CommunitySummary;
import kr.co.iei.mypage.model.vo.UpdateDto;

@Service
public class MypageService {
	
	@Autowired 
	private MypageDao mypageDao;

	public List<CommunitySummary> findCommunityAll(CommunityListRequestDto request) {
		List<CommunitySummary> list = mypageDao.findCommunityAll(request);
		
		return list;
	}//

	public int findCommunityCount(CommunityListRequestDto request) {
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

}
