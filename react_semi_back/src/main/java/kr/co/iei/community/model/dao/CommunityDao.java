package kr.co.iei.community.model.dao;

import java.util.List;

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




}
