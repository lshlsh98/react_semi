package kr.co.iei.market.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.market.model.service.MarketService;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value="/markets")
public class MarketController {

	private MarketService marketService;
}
