package kr.co.iei.mypage.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.mypage.model.vo.CommunityListRequestDto;
import kr.co.iei.mypage.model.vo.CommunitySummary;

@Mapper
public interface MypageDao {

	List<CommunitySummary> findCommunityAll(CommunityListRequestDto clrDto);
	
}
