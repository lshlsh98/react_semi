package kr.co.iei.mypage.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.mypage.model.dao.MypageDao;
import kr.co.iei.mypage.model.vo.CommunityListRequestDto;
import kr.co.iei.mypage.model.vo.CommunitySummary;

@Service
public class MypageService {
	
	@Autowired 
	private MypageDao mypageDao;

	public List<CommunitySummary> findCommunityAll(CommunityListRequestDto clrDto) {
		List<CommunitySummary> list = mypageDao.findCommunityAll(clrDto);
		
		return list;
	}//

}
