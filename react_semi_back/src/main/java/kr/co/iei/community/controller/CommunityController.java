package kr.co.iei.community.controller;

import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.community.model.service.CommunityService;
import kr.co.iei.community.model.vo.Community;
import kr.co.iei.community.model.vo.CommunityComment;
import kr.co.iei.community.model.vo.CommunityListItem;
import kr.co.iei.community.model.vo.CommunityListResponse;

@CrossOrigin(value = "*")
@RequestMapping(value = "/communities")
@RestController
public class CommunityController {
	@Autowired
	private CommunityService communityService;

	// 커뮤니티 리스트 출력
	@GetMapping
	public ResponseEntity<?> selectBoardList(@ModelAttribute CommunityListItem request) {
		CommunityListResponse response = communityService.selectCommunityList(request);
		return ResponseEntity.ok(response);
	}

	// 커뮤니티 글 조회수 변경
	@PatchMapping(value = "/view/{communityNo}")
	public ResponseEntity<?> updateViewCountCommunity(@PathVariable Integer communityNo) {
		int result = communityService.updateViewCountCommunity(communityNo);
		return ResponseEntity.ok(result);
	}

	@PostMapping // 커뮤 게시글 등록
	public ResponseEntity<?> insertCommunity(@ModelAttribute Community community) {
		System.out.println(community);
		Document doc = Jsoup.parse(community.getCommunityContent());
		int result = communityService.insertCommunity(community);
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/{communityNo}") // 커뮤 게시글 상세보기
	public ResponseEntity<?> selectOneCommunity(@PathVariable Integer communityNo) {
		Community community = communityService.selectOneCommunity(communityNo);
		return ResponseEntity.ok(community);
	}

	@PutMapping(value = "/{communityNo}") // 커뮤 게시글 수정하기
	public ResponseEntity<?> updateCommunity(@PathVariable Integer communityNo, @ModelAttribute Community community) {
		community.setCommunityNo(communityNo);
		System.out.println(community);
		int result = communityService.updateCommunity(community);
		return ResponseEntity.ok(result);
	}

	// 메인 페이지용 리스트 조회
	@GetMapping(value = "/main")
	public ResponseEntity<?> selectMainPageCommunityList(@RequestParam String type) {
		// 저는 totalPage가 필요없어서 마켓 리스트 객체를 따로 만들게요 - 이영민
		List<Community> list = communityService.selectMainPageCommunityList(type);
		return ResponseEntity.ok(list);
	}

	@DeleteMapping(value = "/{communityNo}") // 커뮤 게시글 삭제하기
	public ResponseEntity<?> deleteCommunity(@PathVariable Integer communityNo) {
		int result = communityService.deleteCommunity(communityNo);
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/{communityNo}/comments") // 커뮤 댓글 출력
	public ResponseEntity<?> selectCommunityCommentList(@PathVariable Integer communityNo) {
		List<CommunityComment> commentList = communityService.selectCommunityCommentList(communityNo);
		return ResponseEntity.ok(commentList);
	}

	@PostMapping(value = "/comments") // 커뮤 댓글 등록
	public ResponseEntity<?> insertCommunityComment(@RequestBody CommunityComment communityComment) {
		CommunityComment newComment = communityService.insertCommunityComment(communityComment);
		return ResponseEntity.ok(newComment);
	}

	@PutMapping(value = "/comments/{communityCommentNo}") // 커뮤 댓글 수정
	public ResponseEntity<?> updateCommunityComment(@RequestBody CommunityComment comment) {
		int result = communityService.updateCommunityComment(comment);
		return ResponseEntity.ok(result);
	}

	@DeleteMapping(value = "/comments/{communityCommentNo}") // 커뮤 댓글 삭제
	public ResponseEntity<?> deleteCommunityComment(@PathVariable Integer communityCommentNo) {
		int result = communityService.deleteCommunityComment(communityCommentNo);
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/{communityNo}/likes") // 커뮤 좋아요 출력
	public ResponseEntity<?> selectLikeInfo(@PathVariable Integer communityNo,
			@RequestHeader(required = false, name = "Authorization") String token) {
		Map<String, Object> result = communityService.selectLikeInfo(communityNo, token);
		return ResponseEntity.ok(result);
	}

	@PostMapping(value = "/{communityNo}/likes") // 커뮤 좋아요 클릭
	public ResponseEntity<?> likeOn(@PathVariable Integer communityNo,
			@RequestHeader(name = "Authorization") String token) {
		int result = communityService.insertLike(communityNo, token);
		return ResponseEntity.ok(result);
	}

	@DeleteMapping(value = "/{communityNo}/likes") // 커뮤 좋아요 해제(된 상태)
	public ResponseEntity<?> likeOff(@PathVariable Integer communityNo,
			@RequestHeader(name = "Authorization") String token) {
		int result = communityService.deleteLike(communityNo, token);
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/{communityNo}/dislikes") // 커뮤 싫어요 출력
	public ResponseEntity<?> selectDislikeInfo(@PathVariable Integer communityNo,
			@RequestHeader(required = false, name = "Authorization") String token) {
		Map<String, Object> result = communityService.selectDislikeInfo(communityNo, token);
		return ResponseEntity.ok(result);
	}

	@PostMapping(value = "/{communityNo}/dislikes") // 커뮤 싫어요 클릭
	public ResponseEntity<?> dislikeOn(@PathVariable Integer communityNo,
			@RequestHeader(name = "Authorization") String token) {
		int result = communityService.insertDislike(communityNo, token);
		return ResponseEntity.ok(result);
	}

	@DeleteMapping(value = "/{communityNo}/dislikes") // 커뮤 싫어요 해제(된 상태)
	public ResponseEntity<?> dislikeOff(@PathVariable Integer communityNo,
			@RequestHeader(name = "Authorization") String token) {
		int result = communityService.deleteDislike(communityNo, token);
		return ResponseEntity.ok(result);
	}

	@GetMapping(value = "/{communityNo}/reports") // 커뮤 게시판 신고 출력
	public ResponseEntity<?> selectReportInfo(@PathVariable Integer communityNo,
			@RequestHeader(required = false, name = "Authorization") String token) {
		Map<String, Object> reportInfo = communityService.selectReportInfo(communityNo, token);
		return ResponseEntity.ok(reportInfo);
	}

	@PostMapping(value = "/{communityNo}/reports") // 커뮤 게시판 신고 클릭
	public ResponseEntity<?> reportOn(@PathVariable Integer communityNo,
			@RequestHeader(name = "Authorization") String token) {
		int result = communityService.insertReport(communityNo, token);
		return ResponseEntity.ok(result);
	}

	@DeleteMapping(value = "/{communityNo}/reports") // 커뮤 게시판 신고 해제(된 상태)
	public ResponseEntity<?> deleteReport(@PathVariable Integer communityNo,
			@RequestHeader(name = "Authorization") String token) {
		int result = communityService.deleteReport(communityNo, token);
		return ResponseEntity.ok(result);
	}
}
