package kr.co.iei.community.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityComment;

@Mapper
public interface CommunityDao {

	int insertCommunity(Community community);
	
	Community selectOneCommunity(Integer communityNo);

	int insertCommunityComment(CommunityComment communityComment);

	List<CommunityComment> selectCommunityCommentList(Integer communityNo);

	int selectNewCommunityCommentNo();
	
	CommunityComment selectOneCommunityComment(int communityCommentNo);

	int selectLikeCount(Integer communityNo);

	int selectIsLike(Map<String, Object> params);

	int insertLike(Map<String, Object> map);

	int deleteLike(Map<String, Object> map);

	int selectDislikeCount(Integer communityNo);

	int selectIsDislike(Map<String, Object> params);

	int insertDislike(Map<String, Object> map);

	int deleteDislike(Map<String, Object> map);

	int selectReportCount(Integer communityNo);

	int selectIsReport(Map<String, Object> params);

}
