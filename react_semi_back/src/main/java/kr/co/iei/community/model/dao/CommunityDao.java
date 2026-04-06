package kr.co.iei.community.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityListItem;

@Mapper
public interface CommunityDao {

	Integer selectCommunityCount(CommunityListItem request);

	List<Community> selectCommunityList(CommunityListItem request);
	
	int insertCommunity(Community community);
	
	Community selectOneBoard(int communityNo);

	int updateCommunity(Community community);


}
