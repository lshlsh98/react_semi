package kr.co.iei.market.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.market.model.vo.CommentListItem;
import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.Market;
import kr.co.iei.market.model.vo.MarketComment;
import kr.co.iei.market.model.vo.MarketCommentReport;
import kr.co.iei.market.model.vo.MarketFile;

@Mapper
public interface MarketDao {

	Integer selectMarketCount(ListItem request);

	List<Market> selectMarketList(ListItem request);

	int getNewMarketNo();

	int insertMarket(Market market);

	int insertMarketFile(MarketFile marketFile);
	
	List<Market> selectMainPageMarketList(Integer order);
	
	int selectParentCommentCount(CommentListItem req);

	List<MarketComment> selectMarketCommentList(CommentListItem req);
	
    int insertMarketComment(MarketComment marketComment);
    
    int deleteMarketComment(Integer commentNo);
    
    int updateMarketComment(MarketComment marketComment);
    
    int insertMarketCommentReport(MarketCommentReport report);

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
	
}
