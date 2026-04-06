package kr.co.iei.community.controller;

import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.community.model.service.CommunityService;
import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityComment;
import kr.co.iei.community.model.vo.CommunityListResponse;

@CrossOrigin(value="*")
@RequestMapping(value="/communities")
@RestController
public class CommunityController {
	@Autowired
	private CommunityService communityService;
	
	@PostMapping
	public ResponseEntity<?> insertCommunity(@ModelAttribute Community community){
		System.out.println(community);
		Document doc = Jsoup.parse(community.getCommunityContent());
	int result = communityService.insertCommunity(community);
	return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="/{communityNo}")
	public ResponseEntity<?> selectOneCommunity(@PathVariable Integer communityNo){
		Community community = communityService.selectOneCommunity(communityNo);
		return ResponseEntity.ok(community);
	}
	
	@PutMapping(value="/{communityNo}")
	public ResponseEntity<?> updateCommunity(@PathVariable Integer communityNo, @ModelAttribute Community community){
		community.setCommunityNo(communityNo);
		System.out.println(community);
		Document doc = Jsoup.parse(community.getCommunityContent());
		int result = communityService.updateCommunity(community);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value="/comments")
	public ResponseEntity<?> insertCommunityComment(@RequestBody CommunityComment communityComment){
		CommunityComment newComment = communityService.insertCommunityComment(communityComment);
		return ResponseEntity.ok(newComment);
	}
	
	@GetMapping(value="/{communityNo}/comments")
	public ResponseEntity<?> selectCommunityCommentList(@PathVariable Integer communityNo){
		List<CommunityComment> commentList = communityService.selectCommunityCommentList(communityNo);
		return ResponseEntity.ok(commentList);
	}
	
	@PutMapping(value="/comments/{communityCommentNo}")
	public ResponseEntity<?> updateCommunityComment(@RequestBody CommunityComment comment){
		int result = communityService.updateCommunityComment(comment);
		return ResponseEntity.ok(result);
	}
}





