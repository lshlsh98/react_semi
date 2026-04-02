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
	public ResponseEntity<?> selectOneCommunity(@PathVariable int communityNo){
		Community community = communityService.selectOneCommunity(communityNo);
		return ResponseEntity.ok(community);
	}
	
	@PutMapping(value="/{communityNo}")
	public ResponseEntity<?> updateCommunity(@PathVariable int communityNo, @RequestBody Community community){
		int result = communityService.updateCommunity(community);
		return ResponseEntity.ok(result);
	}
}



