package kr.co.iei.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.community.model.service.CommunityService;
import kr.co.iei.utils.FileUtils;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value="/markets")
public class CommunityController {

	@Autowired
	private CommunityService communityService;
	@Autowired
	private FileUtils fileUtil;
}
