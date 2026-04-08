package kr.co.iei.community.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityListItem;
import kr.co.iei.community.model.vo.CommunityComment;

@Mapper
public interface CommunityDao {

	Integer selectCommunityCount(CommunityListItem request);

	List<Community> selectCommunityList(CommunityListItem request);
	
	int insertCommunity(Community community);
	
	Community selectOneCommunity(Integer communityNo);
	
	int updateCommunity(Community community);
	
	List<Community> selectMainPageCommunityList(String type);
	
	int deleteCommunity(Integer communityNo);

	int insertCommunityComment(CommunityComment communityComment);

	List<CommunityComment> selectCommunityCommentList(Integer communityNo);

	int selectNewCommunityCommentNo();
	
	CommunityComment selectOneCommunityComment(int communityCommentNo);
	
	int deleteCommunityComment(Integer communityCommentNo);

	int selectLikeCount(Integer communityNo);

	int selectIsLike(Map<String, Object> params);

	int insertLike(Map<String, Object> map);

	int deleteLike(Map<String, Object> map);

	int selectDislikeCount(Integer communityNo);

	int selectIsDislike(Map<String, Object> params);

	int insertDislike(Map<String, Object> map);

	int deleteDislike(Map<String, Object> map);

	int updateCommunityComment(CommunityComment comment);
	
	int selectReportCount(Integer communityNo);
	
	int selectIsReport(Map<String, Object> params);
	
	int insertReport(Map<String, Object> params);

	int deleteReport(Map<String, Object> params);
}
