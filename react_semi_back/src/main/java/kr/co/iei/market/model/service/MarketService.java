package kr.co.iei.market.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.market.model.dao.MarketDao;
import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.ListResponse;
import kr.co.iei.market.model.vo.Market;
import kr.co.iei.market.model.vo.MarketComment;
import kr.co.iei.market.model.vo.MarketFile;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.utils.JwtUtils;

@Service
public class MarketService {
	@Autowired
	private MarketDao marketDao;
	@Autowired
	private JwtUtils jwtUtil;

	public ListResponse selectMarketList(ListItem request) {
		///총 게시물수 구하기
		Integer totalCount = marketDao.selectMarketCount(request);
		//System.out.println(request);
		//System.out.println("토탈카운트 : " + totalCount);
		
		///총 페이지수 구하기
		int totalPage = (int) Math.ceil(totalCount/(double)request.getSize());
		//System.out.println("토탈페이지 : " + totalPage);
		
		List<Market> list = marketDao.selectMarketList(request);
		//System.out.println(list);
		ListResponse response = new ListResponse(list,totalPage);
		
		return response;
	}
	
	@Transactional
	public int insertMarket(Market market, List<MarketFile> fileList) {
		/// 듀얼테이블을 통해 시퀀스 번호 발급받아오기 (판매게시글등록과 파일등록이 동시에 이뤄지고 테이블이 연결관계 있음)
		int marketNo = marketDao.getNewMarketNo();
		//	System.out.println(marketNo); //시퀀스 번호 발급 정상
		market.setMarketNo(marketNo);
		int result = marketDao.insertMarket(market);
		//System.out.println(result); //게시글 작성 정상
		for (MarketFile marketFile:fileList) {
			marketFile.setMarketNo(marketNo);
			result += marketDao.insertMarketFile(marketFile);
			//파일업로드 정상
		}
		return result;
	}
	
	// 메인페이지
	public List<Market> selectMainPageMarketList(Integer order) {
		List<Market> list = marketDao.selectMainPageMarketList(order);
		return list;
	}
	
	// 댓글 조회
	public List<MarketComment> selectMarketCommentList(Integer marketNo) {
        return marketDao.selectMarketCommentList(marketNo);
    }

	// 댓글 작성
    @Transactional
    public int insertMarketComment(MarketComment marketComment) {
        return marketDao.insertMarketComment(marketComment);
    }

    // 댓글 삭제
    @Transactional
    public int deleteMarketComment(Integer commentNo) {
        return marketDao.deleteMarketComment(commentNo);
    }
	
	@Transactional
	public Market selectOneMarket(Integer marketNo) {
		///마켓 게시글 조회
		
		int result = marketDao.incrementViewCount(marketNo);	//조회수증가
		if(result>0) {
			//System.out.println("조회수증가");
		}
		Market m = marketDao.selectOneMarket(marketNo);
		
		List<MarketFile> fileList = marketDao.selectMarketFileList(marketNo);
		m.setFileList(fileList);
		return m;
	}
	
	
	public Map<String, Object> selectLikeInfo(Integer marketNo, String token) {
		
		int likeCount = marketDao.selectLikeCount(marketNo);	//총 좋아요 수 조회
		//System.out.println("총 좋아요 수 확인 : " + likeCount);
		
		Map<String,Object> result = new HashMap<String,Object>();
		result.put("likeCount", likeCount);
		if(token != null) {
			LoginMember loginMember = jwtUtil.checkToken(token);
			String memberId = loginMember.getMemberId();
			Map<String, Object> params = new HashMap<String,Object>();	//marketNo,memberId 를 담을 객체 (VO대신)
			params.put("marketNo",	marketNo);
			params.put("memberId", memberId);
			int isLike = marketDao.selectIsLike(params);
			//System.out.println("나의 좋아요 상태 : "+isLike);
			result.put("isLike", isLike);
		} else {
			result.put("isLike", 0);
		}
		
		return result;
	}
	
	@Transactional	//좋아요 클릭
	public int likeOn(Integer marketNo, String token) {
		LoginMember loginMember = jwtUtil.checkToken(token);
		
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("marketNo",marketNo);
		params.put("memberId", loginMember.getMemberId());
		int result = marketDao.likeOn(params);
		return result;
	}
	
	@Transactional	//좋아요 해제
	public int likeOff(Integer marketNo, String token) {
		LoginMember loginMember = jwtUtil.checkToken(token);
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("marketNo",marketNo);
		params.put("memberId", loginMember.getMemberId());
		int result = marketDao.likeOff(params);
		return result;
	}
	
	
}
