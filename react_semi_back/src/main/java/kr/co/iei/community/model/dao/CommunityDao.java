package kr.co.iei.community.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityComment;

@Mapper
public interface CommunityDao {

	int insertCommunity(Community community);
	
	Community selectOneCommunity(Integer communityNo);

	int updateCommunity(Community community);

	int selectNewCommunityCommentNo();

	int insertCommunityComment(CommunityComment communityComment);

	CommunityComment selectCommunityComment(int communityCommentNo);

}
