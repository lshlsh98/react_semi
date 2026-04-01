package kr.co.iei.mypage.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.mypage.model.service.MypageService;
import kr.co.iei.mypage.model.vo.CommunityListRequestDto;
import kr.co.iei.mypage.model.vo.CommunityListResponseDto;
import kr.co.iei.mypage.model.vo.CommunitySummary;

@CrossOrigin(value = "*")
@RequestMapping(value = "/mypages")
@RestController
public class MypageController {

	@Autowired
	private MypageService mypageService;

	@GetMapping("board/community")
	public ResponseEntity<?> findCommunityAll(@ModelAttribute CommunityListRequestDto request) {
		List<CommunitySummary> list = mypageService.findCommunityAll(request);

		int count = mypageService.findCommunityCount(request);
		int totalPage = (int) Math.ceil(count / (double) request.getSize()); 
				
		CommunityListResponseDto response = new CommunityListResponseDto(list, totalPage); 
		
		return ResponseEntity.ok(response);
	}//
}
