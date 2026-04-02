package kr.co.iei.mypage.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

import kr.co.iei.mypage.model.vo.CommunityListRequestDto;
import kr.co.iei.mypage.model.vo.CommunitySummary;
import kr.co.iei.mypage.model.vo.UpdateDto;

@Mapper
public interface MypageDao {

	List<CommunitySummary> findCommunityAll(CommunityListRequestDto request);

	int findCommunityCount(CommunityListRequestDto request);

	int updateCommunityStatus(UpdateDto update);

	int deleteCommunity(int boardNo);
	
}
