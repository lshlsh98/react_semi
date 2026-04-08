package kr.co.iei.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.community.model.service.CommunityService;
import kr.co.iei.community.model.vo.CommunityListItem;
import kr.co.iei.community.model.vo.CommunityListResponse;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value="/communities")
public class CommunityController {

	@Autowired
	private CommunityService communityService;
	
	@GetMapping
	public ResponseEntity<?> selectBoardList(@ModelAttribute CommunityListItem request) {
		CommunityListResponse response = communityService.selectCommunityList(request);
		return ResponseEntity.ok(response);
	}
}
