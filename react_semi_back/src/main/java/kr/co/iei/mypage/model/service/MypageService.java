package kr.co.iei.mypage.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.mypage.model.dao.MypageDao;

@Service
public class MypageService {
	
	@Autowired 
	private MypageDao mypageDao;

}
