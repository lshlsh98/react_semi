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
	
	// 커뮤 상세 보기 (특정 게시글)
	public Community selectOneCommunity(int communityNo) {
		Community community = communityDao.selectOneCommunity(communityNo);
		return community;
	}
	
	@Transactional // 커뮤 게시글 수정
	public int updateCommunity(Community community) {
		int result = communityDao.updateCommunity(community);
		return result;
	}
	
	@Transactional // 커뮤 게시글 삭제
	public int deleteCommunity(Integer communityNo) {
		int result = communityDao.deleteCommunity(communityNo);
		return result;
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

	// 좋아요 표시
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

	// 좋아요 클릭
	@Transactional
	public int insertLike(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> map = new HashMap<String,Object>();
		map.put("communityNo", communityNo);
		map.put("memberId", login.getMemberId());
		int result = communityDao.insertLike(map);
		return result;
	}

	// 좋아요 해제
	@Transactional
	public int deleteLike(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("communityNo", communityNo);
		map.put("memberId", login.getMemberId());
		int result = communityDao.deleteLike(map);
		return result;
	}

	// 싫어요 표시
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

	@Transactional // 싫어요 해제
	public int deleteDislike(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("communityNo", communityNo);
		map.put("memberId", login.getMemberId());
		int result = communityDao.deleteDislike(map);
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
	
	// 신고 버튼 출력
	public Map<String, Object> selectReportInfo(Integer communityNo, String token) {
		int reportCount = communityDao.selectReportCount(communityNo);
		Map<String, Object> reportInfo = new HashMap<String,Object>();
		reportInfo.put("reportCount", reportCount);
		if(token != null) {
			LoginMember loginMember = jwtUtil.checkToken(token);
			String memberId = loginMember.getMemberId();
			Map<String, Object> params = new HashMap<String,Object>();
			params.put("communityNo", communityNo);
			params.put("memberId", memberId);
			int isReport = communityDao.selectIsReport(params);
			reportInfo.put("isReport", isReport);
		}else {
			reportInfo.put("isReport", 0);
		}
		return reportInfo;
	}
	
	@Transactional // 신고 클릭
	public int insertReport(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> params = new HashMap<String,Object>();
		params.put("communityNo", communityNo);
		params.put("memberId", login.getMemberId());
		int result = communityDao.insertReport(params);
		return result;
	}

	@Transactional // 신고 해제
	public int deleteReport(Integer communityNo, String token) {
		LoginMember login = jwtUtil.checkToken(token);
		Map<String, Object> params = new HashMap<String,Object>();
		params.put("communityNo", communityNo);
		params.put("memberId", login.getMemberId());
		int result = communityDao.deleteReport(params);
		return result;
	}
	
}



