package kr.co.iei.community.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.community.model.dao.CommunityDao;

@Service
public class CommunityService {

	@Autowired
	private CommunityDao communityDao;
}
