package kr.co.iei.market.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.Market;
import kr.co.iei.market.model.vo.MarketComment;
import kr.co.iei.market.model.vo.MarketFile;
import kr.co.iei.market.model.vo.MarketReport;
import kr.co.iei.market.model.vo.TradeRequest;

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

	Market selectOneMarket(Integer marketNo, String memberId);

	List<MarketFile> selectMarketFileList(Integer marketNo);

	int incrementViewCount(Integer marketNo);

	int selectLikeCount(Integer marketNo);

	int selectIsLike(Map<String, Object> params);

	int likeOn(Map<String, Object> params);

	int likeOff(Map<String, Object> params);

	List<String> getFilePath(Integer marketNo);

	int deleteFileTbl(Integer marketNo);

	int deleteOneMarket(Integer marketNo);

	List<TradeRequest> selectAllTradeRequest(Integer marketNo);

	int tradeAccepted(Integer marketNo, String buyerId);

	int tradeReject(Integer marketNo, String buyerId);

	int marketCompleted(Integer marketNo);

	int tradeRequest(TradeRequest request);

	int tradeRequestCancel(Integer marketNo, String buyerId);

	int cancelReport(Integer marketNo, String memberId);

	int pushReport(MarketReport marketReport);

	Market selectSellerId(Integer marketNo);

	int addPointHistory(Integer marketNo, String sellerId);

	int addPointMember(String sellerId);
	

	

	
}
