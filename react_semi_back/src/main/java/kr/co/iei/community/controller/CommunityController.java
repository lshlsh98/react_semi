package kr.co.iei.community.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
	
	@PostMapping // 커뮤 글 등록
	public ResponseEntity<?> insertCommunity(@ModelAttribute Community community){
		System.out.println(community);
		Document doc = Jsoup.parse(community.getCommunityContent());
	int result = communityService.insertCommunity(community);
	return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="/{communityNo}") // 커뮤 상세보기
	public ResponseEntity<?> selectOneCommunity(@PathVariable Integer communityNo){
		Community community = communityService.selectOneCommunity(communityNo);
		return ResponseEntity.ok(community);
	}
	
	@GetMapping(value="/{communityNo}/comments") // 커뮤 댓글 출력
	public ResponseEntity<?> selectCommunityCommentList(@PathVariable Integer communityNo){
		List<CommunityComment> commentList = communityService.selectCommunityCommentList(communityNo);
		return ResponseEntity.ok(commentList);
	}
	
	
	@PostMapping(value="/comments") // 커뮤 댓글 등록
	public ResponseEntity<?> insertCommunityComment(@RequestBody CommunityComment communityComment){
		CommunityComment newComment = communityService.insertCommunityComment(communityComment);
		return ResponseEntity.ok(newComment);
	}
	
	@GetMapping(value="/{communityNo}/likes") // 커뮤 좋아요 출력
	public ResponseEntity<?> selectLikeInfo(@PathVariable Integer communityNo, @RequestHeader(required = false, name="Authorization") String token){
		Map<String, Object> result = communityService.selectLikeInfo(communityNo, token);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value="/{communityNo}/likes") // 커뮤 좋아요 클릭
	public ResponseEntity<?> likeOn(@PathVariable Integer communityNo,
					@RequestHeader(name="Authorization") String token){
		int result = communityService.insertLike(communityNo,token);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping(value="/{communityNo}/likes") // 커뮤 좋아요 "삭제"
	public ResponseEntity<?> likeOff(@PathVariable Integer communityNo,
			@RequestHeader(name="Authorization") String token){
		int result = communityService.deleteLike(communityNo, token);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="/{communityNo}/dislikes") // 커뮤 싫어요 출력
	public ResponseEntity<?> selectDislikeInfo(@PathVariable Integer communityNo,
				@RequestHeader(required = false, name="Authorization") String token){
			Map<String, Object> result = communityService.selectDislikeInfo(communityNo, token);
	return ResponseEntity.ok(result);
	}
	
	@PostMapping(value="/{communityNo}/dislikes") // 커뮤 싫어요 클릭
	public ResponseEntity<?> dislikeOn(@PathVariable Integer communityNo,
			@RequestHeader(name="Authorization") String token){
	int result = communityService.insertDislike(communityNo,token);
	return ResponseEntity.ok(result);
	}
	
	@DeleteMapping(value="/{communityNo}/dislikes") // 커뮤 싫어요 "삭제"
	public ResponseEntity<?> dislikeOff(@PathVariable Integer communityNo,
				@RequestHeader(name="Authorization") String token){
		int result = communityService.deleteDislike(communityNo, token);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="/{communityNo}/reports") // 커뮤 신고 출력
	public ResponseEntity<?> selectReportInfo(@PathVariable Integer communityNo,
				@RequestHeader(required = false, name="Authorization") String token){
		Map<String, Object> reportInfo = communityService.selectReportInfo(communityNo, token);
		return ResponseEntity.ok(reportInfo);
	}
}




