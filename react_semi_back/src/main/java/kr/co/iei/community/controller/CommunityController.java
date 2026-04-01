package kr.co.iei.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.community.model.service.CommunityService;
import kr.co.iei.community.model.vo.Community;

@CrossOrigin(value="*")
@RequestMapping(value="/communities")
@RestController
public class CommunityController {

	@Autowired
	private CommunityService communityService;
	
	@PostMapping
	public ResponseEntity<?> insertCommunity(@RequestBody Community community){
	int result = communityService.insertCommunity(community);
	return ResponseEntity.ok(result);
	}
}



