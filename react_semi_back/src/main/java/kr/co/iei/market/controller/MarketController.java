package kr.co.iei.market.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import kr.co.iei.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
	
	// 메인 페이지용 5개 리스트 조회
	@GetMapping("/main")
	public ResponseEntity<?> selectMainPageMarketList(@RequestParam Integer order){
		// 저는 totalPage가 필요없어서 마켓 리스트 객체를 따로 만들게요 - 이영민
		List<Market> list = marketService.selectMainPageMarketList(order);
		return ResponseEntity.ok(list);
	}
	
	@GetMapping(value="/{marketNo}")
	public ResponseEntity<?> selectOneMarket(@PathVariable Integer marketNo){
		//System.out.println(marketNo);
		Market m = marketService.selectOneMarket(marketNo);
		//System.out.println(m);
		return ResponseEntity.ok(m);
	}
	
	@GetMapping(value="/{marketNo}/likes")
	public ResponseEntity<?> selectLikeInfo(@PathVariable Integer marketNo, @RequestHeader(name="Authorization") String token){
		System.out.println("글번호 확인 : " + marketNo);
		System.out.println("토큰 확인" + token);
		Map<String,Object> result = marketService.selectLikeInfo(marketNo,token);
		return ResponseEntity.ok("확인");
	}
}
