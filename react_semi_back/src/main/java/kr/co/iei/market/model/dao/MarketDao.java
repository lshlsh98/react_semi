package kr.co.iei.market.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.Market;
import kr.co.iei.market.model.vo.MarketComment;
import kr.co.iei.market.model.vo.MarketFile;

@Mapper
public interface MarketDao {

	Integer selectMarketCount(ListItem request);

	List<Market> selectMarketList(ListItem request);

	int getNewMarketNo();

	int insertMarket(Market market);

	int insertMarketFile(MarketFile marketFile);
	
	List<Market> selectMainPageMarketList(Integer order);
	
	List<MarketComment> selectMarketCommentList(Integer marketNo);
	
    int insertMarketComment(MarketComment marketComment);
    
    int deleteMarketComment(Integer commentNo);

	Market selectOneMarket(Integer marketNo);

	List<MarketFile> selectMarketFileList(Integer marketNo);

	int incrementViewCount(Integer marketNo);

	int selectLikeCount(Integer marketNo);

	
}
