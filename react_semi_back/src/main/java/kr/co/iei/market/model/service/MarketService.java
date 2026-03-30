package kr.co.iei.market.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.market.model.dao.MarketDao;
import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.ListResponse;
import kr.co.iei.market.model.vo.Market;

@Service
public class MarketService {
	@Autowired
	private MarketDao marketDao;

	public ListResponse selectMarketList(ListItem request) {
		///총 게시물수 구하기
		Integer totalCount = marketDao.selectMarketCount(request);
		//System.out.println(request);
		//System.out.println(totalCount);
		
		///총 페이지수 구하기
		int totalPage = (int) Math.ceil(totalCount/(double)request.getSize());
		//System.out.println(totalPage);
		
		List<Market> list = marketDao.selectMarketList(request);
		//System.out.println(list);
		ListResponse response = new ListResponse(list,totalPage);
		
		return response;
	}
	
	
}
