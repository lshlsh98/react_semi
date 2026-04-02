package kr.co.iei.community.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.community.model.vo.Community;

@Mapper
public interface CommunityDao {

	int insertCommunity(Community community);
	
	Community selectOneCommunity(int communityNo);

	int updateCommunity(Community community);

}
