package kr.co.iei.market.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.market.model.dao.MarketDao;
import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.ListResponse;
import kr.co.iei.market.model.vo.Market;
import kr.co.iei.market.model.vo.MarketFile;

@Service
public class MarketService {
	@Autowired
	private MarketDao marketDao;

	public ListResponse selectMarketList(ListItem request) {
		///총 게시물수 구하기
		Integer totalCount = marketDao.selectMarketCount(request);
		System.out.println(request);
		System.out.println("토탈카운트 : " + totalCount);
		
		///총 페이지수 구하기
		int totalPage = (int) Math.ceil(totalCount/(double)request.getSize());
		System.out.println("토탈페이지 : " + totalPage);
		
		List<Market> list = marketDao.selectMarketList(request);
		//System.out.println(list);
		ListResponse response = new ListResponse(list,totalPage);
		
		return response;
	}
	
	@Transactional
	public int insertMarket(Market market, List<MarketFile> fileList) {
		/// 듀얼테이블을 통해 시퀀스 번호 발급받아오기 (판매게시글등록과 파일등록이 동시에 이뤄지고 테이블이 연결관계 있음)
		int marketNo = marketDao.getNewMarketNo();
		//	System.out.println(marketNo); //시퀀스 번호 발급 정상
		market.setMarketNo(marketNo);
		int result = marketDao.insertMarket(market);
		//System.out.println(result); //게시글 작성 정상
		for (MarketFile marketFile:fileList) {
			marketFile.setMarketNo(marketNo);
			result += marketDao.insertMarketFile(marketFile);
			
		}
		return result;
	}
	
	public List<Market> selectMainPageMarketList(Integer order) {
		List<Market> list = marketDao.selectMainPageMarketList(order);
		return list;
	}
}
