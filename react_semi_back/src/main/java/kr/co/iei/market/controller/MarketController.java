package kr.co.iei.market.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import kr.co.iei.utils.JwtUtils;

import org.apache.ibatis.annotations.Delete;
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
	
	// 거래 게시글 수정하기 - 장지혁
	@PutMapping(value="/{marketNo}")
	public ResponseEntity<?> updateMarket(@PathVariable Integer marketNo,
								@ModelAttribute Market market,
							@ModelAttribute List<MultipartFile> files){
			market.setMarketNo(marketNo);
			System.out.println(market);
		Document doc = Jsoup.parse(market.getMarketContent());
		Element ele = doc.selectFirst("img");
		String marketThumb = ele == null ? null : ele.attr("src");
		market.setMarketThumb(marketThumb);
		List<MarketFile> addFileList = new ArrayList<MarketFile>();
		String savepath = root + "market/";
		if(files != null) {
			for(MultipartFile file : files) {
				String marketFileName = file.getOriginalFilename();
				String marketFilePath = fileUtil.upload(savepath, file);
				MarketFile marketFile = new MarketFile();
				marketFile.setMarketFileName(marketFileName);
				marketFile.setMarketFilePath(marketFilePath);
				marketFile.setMarketNo(marketNo);
				addFileList.add(marketFile);
			}
		}
		int result = marketService.updateMarket(market,addFileList);
		if(result > 0 && market.getDeleteFilePath() != null) {
			for(String marketFilePath : market.getDeleteFilePath()) {
				File deleteFile = new File(savepath + marketFilePath);
				deleteFile.delete();
			}
		}
		return ResponseEntity.ok(result);
	}
	
	// 거래 게시글 삭제하기 - 장지혁
	@DeleteMapping(value="/{marketNo}")
	public ResponseEntity<?> deleteMarket(@PathVariable Integer marketNo){
		int result = marketService.deleteMarket(marketNo);
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
	public ResponseEntity<?> selectOneMarket(@PathVariable Integer marketNo){
		//System.out.println(marketNo);
		Market m = marketService.selectOneMarket(marketNo);
		//System.out.println(m);
		return ResponseEntity.ok(m);
	}
	
	@GetMapping(value="/{marketNo}/likes")
	public ResponseEntity<?> selectLikeInfo(@PathVariable Integer marketNo, @RequestHeader(required = false,name="Authorization") String token){
		//System.out.println("글번호 확인 : " + marketNo);	//정상 확인
		//System.out.println("토큰 확인 : " + token);	//로그인 or 로그아웃 상황시 확인완료
		Map<String,Object> result = marketService.selectLikeInfo(marketNo,token);
		//System.out.println(result);
		return ResponseEntity.ok(result);
	}
	
	// 좋아요 누르기
	@PostMapping(value="/{marketNo}/likes")
	public ResponseEntity<?> likeOn(@PathVariable Integer marketNo,@RequestHeader(name="Authorization") String token){
		int result = marketService.likeOn(marketNo,token);
		return ResponseEntity.ok(result);
	}
	
	// 좋아요 삭제
	@DeleteMapping(value="/{marketNo}/likes")
	public ResponseEntity<?> likeOff(@PathVariable Integer marketNo,@RequestHeader(name="Authorization") String token){
		int result = marketService.likeOff(marketNo,token);
		return ResponseEntity.ok(result);
	}
}
