package kr.co.iei.community.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityComment;

@Mapper
public interface CommunityDao {

	int insertCommunity(Community community);
	
	Community selectOneCommunity(Integer communityNo);

	int selectNewCommunityCommentNo();

	int insertCommunityComment(CommunityComment communityComment);

	CommunityComment selectCommunityComment(int communityCommentNo);

	List<CommunityComment> selectCommunityCommentList(Integer communityNo);

	int updateCommunityComment(CommunityComment comment);


}
