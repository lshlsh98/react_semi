package kr.co.iei.community.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.community.model.dao.CommunityDao;
import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityListItem;
import kr.co.iei.community.model.vo.CommunityListResponse;

@Service
public class CommunityService {

	@Autowired
	private CommunityDao communityDao;

	public CommunityListResponse selectCommunityList(CommunityListItem request) {
		Integer totalCount = communityDao.selectCommunityCount(request);
		int totalPage = (int) Math.ceil(totalCount / (double) request.getSize());

		List<Community> list = communityDao.selectCommunityList(request);
		CommunityListResponse response = new CommunityListResponse(list, totalPage);
		return response;
	}
	
	@Transactional
	public int insertCommunity(Community community) {
		int result = communityDao.insertCommunity(community);
		return result;
	}
	
	
	public Community selectOneCommunity(int communityNo) {
		Community community = communityDao.selectOneBoard(communityNo);
		return community;
	}
	
	@Transactional
	public int updateCommunity(Community community) {
		int result = communityDao.updateCommunity(community);
		return result;
	}

	public List<Community> selectMainPageCommunityList(String type) {
		return communityDao.selectMainPageCommunityList(type);
	}
}
