package kr.co.iei.community.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.community.model.dao.CommunityDao;
import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityComment;

@Service
public class CommunityService {

	@Autowired
	private CommunityDao communityDao;

	@Transactional
	public int insertCommunity(Community community) {
		int result = communityDao.insertCommunity(community);
		return result;
	}
	
	
	public Community selectOneCommunity(int communityNo) {
		Community community = communityDao.selectOneCommunity(communityNo);
		return community;
	}

	@Transactional
	public int updateCommunity(Community community) {
		int result = communityDao.updateCommunity(community);
		return result;
	}
	@Transactional
	public CommunityComment insertCommunityComment(CommunityComment communityComment) {
		int communityCommentNo = communityDao.selectNewCommunityCommentNo();
		communityComment.setCommunityCommentNo(communityCommentNo);
		int result = communityDao.insertCommunityComment(communityComment);
		CommunityComment newComment = communityDao.selectCommunityComment(communityCommentNo);
		return newComment;
	}

	

}
