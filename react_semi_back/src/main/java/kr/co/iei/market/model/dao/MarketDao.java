package kr.co.iei.market.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.Market;

@Mapper
public interface MarketDao {

	Integer selectMarketCount(ListItem request);

	List<Market> selectMarketList(ListItem request);
}
