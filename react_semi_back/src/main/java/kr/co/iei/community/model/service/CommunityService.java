package kr.co.iei.community.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
