package kr.co.iei.market.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.market.model.dao.MarketDao;


@Service
public class MarketService {

	 @Autowired
	 private MarketDao marketDao;
}
