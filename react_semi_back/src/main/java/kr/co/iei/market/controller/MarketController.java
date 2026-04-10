package kr.co.iei.market.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kr.co.iei.utils.JwtUtils;

import org.apache.catalina.connector.Response;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import kr.co.iei.WebConfig;
import kr.co.iei.market.model.service.MarketService;
import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.ListResponse;
import kr.co.iei.market.model.vo.Market;
import kr.co.iei.market.model.vo.MarketComment;
import kr.co.iei.market.model.vo.MarketFile;
import kr.co.iei.market.model.vo.TradeRequest;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.utils.FileUtils;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value="/markets")

public class MarketController {
   	@Autowired
	private MarketService marketService;
	@Value("${file.root}")
	private String root;
	@Autowired
	private FileUtils fileUtil;

	
	///전체 마켓게시글 조회
	@GetMapping
	public ResponseEntity<?> selectMarketList(@ModelAttribute ListItem request){
		ListResponse response = marketService.selectMarketList(request);
	    return ResponseEntity.ok(response);
	}
	
	@PostMapping
	public ResponseEntity<?> insertMarket(@ModelAttribute Market market, @ModelAttribute List<MultipartFile> files){
		//System.out.println(market);				//정상작동 확인
		
		/*---------------------files 정상작동 확인--------------------------
		for (MultipartFile file : files) {
			System.out.println("파일명: " + file.getOriginalFilename());
			System.out.println("크기: " + file.getSize());
			System.out.println("타입: " + file.getContentType());
		}
		--------------------------------------------------------------------*/
		
		List<MarketFile> fileList = new ArrayList<MarketFile>();
		
		 if(files != null) {
			 
			 String savepath = root+ "market/";
			 for (MultipartFile file : files) {
				 String marketFileName = file.getOriginalFilename();
				 String marketFilepath = fileUtil.upload(savepath, file);
				 MarketFile marketFile = new MarketFile();
				 marketFile.setMarketFileName(marketFileName);
				 marketFile.setMarketFilePath(marketFilepath);
				 fileList.add(marketFile);
				 //System.out.println(marketFile);	// 파일첨부시 marketFile 객체생성확인
			 }	
			 
		} else {
			
		}
		int result = marketService.insertMarket(market, fileList);
		
		return ResponseEntity.ok(result);
	}
	
	// 메인 페이지용 5개 리스트 조회 - 이영민
	@GetMapping("/main")
	public ResponseEntity<?> selectMainPageMarketList(@RequestParam Integer order){
		// 저는 totalPage가 필요없어서 마켓 리스트 객체를 따로 만들게요 - 이영민
		List<Market> list = marketService.selectMainPageMarketList(order);
		return ResponseEntity.ok(list);
	}
	
	// 1. 특정 게시글의 댓글 목록 조회 - 이영민
    @GetMapping(value="/{marketNo}/comments")
    public ResponseEntity<?> selectMarketCommentList(@PathVariable Integer marketNo) {
        List<MarketComment> list = marketService.selectMarketCommentList(marketNo);
        return ResponseEntity.ok(list);
    }

    // 2. 댓글 작성 (대댓글 포함) - 이영민
    @PostMapping(value="/comments")
    public ResponseEntity<?> insertMarketComment(@RequestBody MarketComment marketComment) {
        // 💡 팁: 앞선 게시글 등록은 이미지가 있어서 @ModelAttribute를 썼지만, 
        // 단순 텍스트인 댓글은 프론트에서 JSON으로 보내므로 @RequestBody를 써야 합니다!
        int result = marketService.insertMarketComment(marketComment);
        return ResponseEntity.ok(result);
    }

    // 3. 댓글 삭제 - 이영민
    @DeleteMapping(value="/comments/{commentNo}")
    public ResponseEntity<?> deleteMarketComment(@PathVariable Integer commentNo) {
        int result = marketService.deleteMarketComment(commentNo);
        return ResponseEntity.ok(result);
    }
	
	@GetMapping(value="/{marketNo}")
	public ResponseEntity<?> selectOneMarket(@PathVariable Integer marketNo ,@RequestHeader(required = false,name="Authorization") String token){
		//System.out.println(marketNo);
		
		Market m = marketService.selectOneMarket(marketNo,token);
		//System.out.println(m);
		return ResponseEntity.ok(m);
	}
	
	
	/// 파일삭제 메소드 (출처 : MemberService)
		private boolean deleteFile(String filename, String root) {
			if (filename == null || filename.isEmpty())
				return false;
			File file = new File(root + filename);
			if (file.exists()) {
				return file.delete();
				// 파일 삭제 성공시 true 리턴
			}
			return false;
		}
	@DeleteMapping(value="/{marketNo}") //게시글삭제
	public ResponseEntity<?> deleteOneMarket(@PathVariable Integer marketNo){
		System.out.println("글번호 확인 " + marketNo);
		String savepath = root + "market/";
		System.out.println(savepath);
		
		//1. 파일패스 가져오기
		List<String> fileList = marketService.getFilePath(marketNo);
		System.out.println(fileList);
				
		//2.서비스 처리 (market_file_tbl 삭제, market_tbl 삭제)
		Map<String,Object> serviceResponse = new HashMap<String,Object>();
		serviceResponse = marketService.deleteOneMarketAndFileTbl(marketNo);
		int fileCount = (int) serviceResponse.get("fileCount");
		int result = (int) serviceResponse.get("result");
		System.out.println("파일TBL 삭제 결과 (1~10) : " + fileCount);
		System.out.println("마켓TBL 삭제 결과 (0~1) : " + result);
		
		//4. 파일 삭제
		boolean allDeleted = true;
		if (result == 1) {
		    if (fileList != null && !fileList.isEmpty()) {
		        for (String fileName : fileList) {
		            boolean bool = deleteFile(fileName, savepath);
		            if (!bool) {
		                allDeleted = false;
		            }
		        }
		    }
		}
		System.out.println("전체파일 삭제결과 : " + allDeleted);
		
		Map<String,Object> response = new HashMap<String,Object>();
		response.put("fileCount",fileCount);	//프론트에 전달할 삭제파일 갯수
		response.put("allDeleted", allDeleted);	//프론트에 전달할 전체 삭제 정상 여부
		response.put("result", result);			//프론트에 전달할 게시물 삭제 여부
		return ResponseEntity.ok(response);
		
	}
	
	
	
	//좋아요
	@PostMapping(value="/{marketNo}/likes")
	public ResponseEntity<?> likeOn(@PathVariable Integer marketNo,@RequestHeader(name="Authorization") String token){
		int result = marketService.likeOn(marketNo,token);
		return ResponseEntity.ok(result);
	}
	//좋아요 취소
	@DeleteMapping(value="/{marketNo}/likes")
	public ResponseEntity<?> likeOff(@PathVariable Integer marketNo,@RequestHeader(name="Authorization") String token){
		int result = marketService.likeOff(marketNo,token);
		return ResponseEntity.ok(result);
	}
	//신고 취소
	@DeleteMapping(value="/{marketNo}/reports")
	public ResponseEntity<?> cancelReport (@PathVariable Integer marketNo,@RequestHeader(name="Authorization") String token ){
		int result = marketService.cancelReport(marketNo,token);
		return ResponseEntity.ok(result);
	}
	
	//거래요청
	@PostMapping(value="{marketNo}/request")
	public ResponseEntity<?> tradeRequest(@PathVariable Integer marketNo,@RequestHeader(name="Authorization") String token){
		int result = marketService.tradeRequest(marketNo,token);
		return ResponseEntity.ok(result);
	}
	//거래요청취소
	@DeleteMapping(value="{marketNo}/cancel")
	public ResponseEntity<?> tradeRequestCancel(@PathVariable Integer marketNo,@RequestHeader(name="Authorization") String token){
		int result = marketService.tradeRequestCancel(marketNo,token);
		return ResponseEntity.ok(result);
	}
	//거래완료시 거래요청 리스트 조회
	@GetMapping(value="/{marketNo}/complete")
	public ResponseEntity<?> selectAllTradeRequest(@PathVariable Integer marketNo){
		//System.out.println("글번호확인 : " + marketNo);
		List<TradeRequest> list = marketService.selectAllTradeRequest(marketNo);
		//System.out.println(list);
		return ResponseEntity.ok(list);
	}
	
	//거래확정
	@PatchMapping(value="{marketNo}/complete/{buyerId}")
	public ResponseEntity<?> tradeComplete(@PathVariable Integer marketNo,@PathVariable String buyerId){
		System.out.println("거래번호 : " + marketNo);
		System.out.println("구매자아이디" + buyerId);
		int result = marketService.tradeComplete(marketNo,buyerId);
		return ResponseEntity.ok(result);
	}
	
	
}
