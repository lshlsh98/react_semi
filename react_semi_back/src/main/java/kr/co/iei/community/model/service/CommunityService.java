package kr.co.iei.community.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.community.model.dao.CommunityDao;
import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityComment;
import kr.co.iei.community.model.vo.CommunityListResponse;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.utils.JwtUtils;

@Service
public class CommunityService {

	@Autowired
	private CommunityDao communityDao;
	@Autowired
	private JwtUtils jwtUtil;
	
	@Transactional // 커뮤 글 등록
	public int insertCommunity(Community community) {
		int result = communityDao.insertCommunity(community);
		return result;
	}
	
	public Community selectOneCommunity(int communityNo) {
		Community community = communityDao.selectOneCommunity(communityNo);
		return community;
	}

	public List<CommunityComment> selectCommunityCommentList(Integer communityNo) {
		List<CommunityComment> commentList = communityDao.selectCommunityCommentList(communityNo);
		return commentList;
	}

	@Transactional
	public CommunityComment insertCommunityComment(CommunityComment communityComment) {
		int communityCommentNo = communityDao.selectNewCommunityCommentNo();
		communityComment.setCommunityCommentNo(communityCommentNo);
		int result = communityDao.insertCommunityComment(communityComment);
		CommunityComment newComment = communityDao.selectOneCommunityComment(communityCommentNo);
		return newComment;
	}

	public Map<String, Object> selectLikeInfo(Integer communityNo, String token) {
		int likeCount = communityDao.selectLikeCount(communityNo);
		Map<String, Object> likeInfo = new HashMap<String,Object>();
		likeInfo.put("likeCount", likeCount);
		if(token != null) {
			LoginMember loginMember = jwtUtil.checkToken(token);
			String memberId = loginMember.getMemberId();
			Map<String, Object> params = new HashMap<String,Object>();
			params.put("communityNo", communityNo);
			params.put("memberId", memberId);
			int isLike = communityDao.selectIsLike(params);
			likeInfo.put("isLike", isLike);
		}else {
			likeInfo.put("isLike", 0);
		}
		return likeInfo;
	}

	public int insertLike(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("communityNo", communityNo);
		map.put("memberId", login.getMemberId());
		int result = communityDao.insertLike(map);
		return result;
	}

	@Transactional
	public int deleteLike(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("communityNo", communityNo);
		map.put("memberId", login.getMemberId());
		int result = communityDao.deleteLike(map);
		return result;
	}

	public Map<String, Object> selectDislikeInfo(Integer communityNo, String token) {
		int dislikeCount = communityDao.selectDislikeCount(communityNo);
		Map<String, Object> dislikeInfo = new HashMap<String,Object>();
		dislikeInfo.put("dislikeCount", dislikeCount);
		if(token != null) {
			LoginMember loginMember = jwtUtil.checkToken(token);
			String memberId = loginMember.getMemberId();
			Map<String, Object> params = new HashMap<String,Object>();
			params.put("communityNo", communityNo);
			params.put("memberId", memberId);
			int isDislike = communityDao.selectIsDislike(params);
			dislikeInfo.put("isDislike", isDislike);
		}else {
			dislikeInfo.put("isDislike", 0);
		}
		return dislikeInfo;
	}

	public int insertDislike(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("communityNo", communityNo);
		map.put("memberId", login.getMemberId());
		int result = communityDao.insertDislike(map);
		return result;
	}

	@Transactional
	public int deleteDislike(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("communityNo", communityNo);
		map.put("memberId", login.getMemberId());
		int result = communityDao.deleteDislike(map);
		return result;
	}

	public Map<String, Object> selectReportInfo(Integer communityNo, String token) {
		int reportCount = communityDao.selectReportCount(communityNo);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("reportCount", reportCount);
		if(token != null) {
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("communityNo", communityNo);
			LoginMember loginMember = jwtUtil.checkToken(token);
			String memberId = loginMember.getMemberId();
			params.put("memberId", memberId);
			int isReport = communityDao.selectIsReport(params);
			result.put("isReport", isReport);
		}else {
			result.put("isReport", 0);
		}
		return result;
	}

	@Transactional
	public int insertReport(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> params = new HashMap<String,Object>();
		params.put("communityNo", communityNo);
		params.put("memberId", login.getMemberId());
		int result = communityDao.insertReport(params);
		return result;
	}

	public int deleteCommunityComment(Integer communityCommentNo) {
		int result = communityDao.deleteCommunityComment(communityCommentNo);
		return result;
	}

	public int updateCommunityComment(CommunityComment comment) {
		int result = communityDao.updateCommunityComment(comment);
		return result;
	}

}



