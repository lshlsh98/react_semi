package kr.co.iei.community.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.community.model.service.CommunityService;
import kr.co.iei.community.model.vo.CommunityListItem;
import kr.co.iei.community.model.vo.CommunityListResponse;
import kr.co.iei.community.model.vo.Community;

@CrossOrigin(value="*")
@RequestMapping(value="/communities")
@RestController
public class CommunityController {

	@Autowired
	private CommunityService communityService;
	
	@GetMapping
	public ResponseEntity<?> selectBoardList(@ModelAttribute CommunityListItem request) {
		CommunityListResponse response = communityService.selectCommunityList(request);
		return ResponseEntity.ok(response);
	}
		
	@PostMapping
	public ResponseEntity<?> insertCommunity(@RequestBody Community community){
	int result = communityService.insertCommunity(community);
	return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="/{communityNo}")
	public ResponseEntity<?> selectOneCommunity(@PathVariable int communityNo){
		Community community = communityService.selectOneCommunity(communityNo);
		return ResponseEntity.ok(community);
	}
	
	@PutMapping(value="/{communityNo}")
	public ResponseEntity<?> updateCommunity(@PathVariable int communityNo, @RequestBody Community community){
		int result = communityService.updateCommunity(community);
		return ResponseEntity.ok(result);
	}
	
	// 메인 페이지용 리스트 조회
	@GetMapping(value="/main")
	public ResponseEntity<?> selectMainPageCommunityList(@RequestParam String type){
		// 저는 totalPage가 필요없어서 마켓 리스트 객체를 따로 만들게요 - 이영민
		List<Community> list = communityService.selectMainPageCommunityList(type);
		return ResponseEntity.ok(list);
	}
}



