package kr.co.iei.market.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
			 /// To : Team 4 대장님
			 /// Todo : 마켓게시판 글작성시 파일저장경로 확인후 수정
			 /// Application Properties 에서 파일경로 임시 수정했습니다
			 /// 확인후 폴더변경(root + "market/")바랍니다~
			 String savepath = root;
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
}
