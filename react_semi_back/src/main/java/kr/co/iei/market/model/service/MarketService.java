package kr.co.iei.market.model.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.market.model.dao.MarketDao;
import kr.co.iei.market.model.vo.CommentListItem;
import kr.co.iei.market.model.vo.ListItem;
import kr.co.iei.market.model.vo.ListResponse;
import kr.co.iei.market.model.vo.Market;
import kr.co.iei.market.model.vo.MarketComment;
import kr.co.iei.market.model.vo.MarketCommentReport;
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
		/// 총 게시물수 구하기
		Integer totalCount = marketDao.selectMarketCount(request);
		// System.out.println(request);
		// System.out.println("토탈카운트 : " + totalCount);

		/// 총 페이지수 구하기
		int totalPage = (int) Math.ceil(totalCount / (double) request.getSize());
		// System.out.println("토탈페이지 : " + totalPage);

		List<Market> list = marketDao.selectMarketList(request);
		// System.out.println(list);
		ListResponse response = new ListResponse(list, totalPage);

		return response;
	}

	@Transactional
	public int insertMarket(Market market, List<MarketFile> fileList) {
		/// 듀얼테이블을 통해 시퀀스 번호 발급받아오기 (판매게시글등록과 파일등록이 동시에 이뤄지고 테이블이 연결관계 있음)
		int marketNo = marketDao.getNewMarketNo();
		// System.out.println(marketNo); //시퀀스 번호 발급 정상
		market.setMarketNo(marketNo);
		int result = marketDao.insertMarket(market);
		// System.out.println(result); //게시글 작성 정상
		for (MarketFile marketFile : fileList) {
			marketFile.setMarketNo(marketNo);
			result += marketDao.insertMarketFile(marketFile);
			// 파일업로드 정상
		}
		return result;
	}

	// 메인페이지
	public List<Market> selectMainPageMarketList(Integer order) {
		List<Market> list = marketDao.selectMainPageMarketList(order);
		return list;
	}

	// 댓글 조회
	public ListResponse selectMarketCommentList(CommentListItem item) {
			
		int totalCount = marketDao.selectParentCommentCount(item);	// 총 부모 댓글 수 구하기 (자식 답글은 페이지 계산에서 제외)
		int totalPage = (int) Math.ceil(totalCount / (double) item.getSize());	// 총 페이지 수 계산
			
		List<MarketComment> list = marketDao.selectMarketCommentList(item);
			
		ListResponse response = new ListResponse(list, totalPage);
			
		return response;
	}

	// 댓글 작성
    @Transactional
    public int insertMarketComment(MarketComment marketComment) {
    	int result = marketDao.insertMarketComment(marketComment);
        return result;
    }

    // 댓글 삭제
    @Transactional
    public int deleteMarketComment(Integer commentNo) {
    	int result = marketDao.deleteMarketComment(commentNo);
        return result;
    }
    
    // 댓글 수정
    @Transactional
    public int updateMarketComment(MarketComment marketComment) {
    	int result = marketDao.updateMarketComment(marketComment);
        return result;
    }
    
    // 댓글 신고
    @Transactional
    public int insertMarketCommentReport(MarketCommentReport report) {
    	int result = marketDao.insertMarketCommentReport(report);
        return result;
    }
	
	@Transactional
	public Market selectOneMarket(Integer marketNo, String token) {
		/// 마켓 게시글 조회

		marketDao.incrementViewCount(marketNo); 								//조회수증가로직
		
		String memberId = null;
		if (token != null) {
			LoginMember loginMember = jwtUtil.checkToken(token);				//토큰으로 로그인 객체 생성
			memberId = loginMember.getMemberId();								//로그인 객체에서 아이디 추출
		}
		
		Market m = marketDao.selectOneMarket(marketNo,memberId);				//market 객체 생성
		List<MarketFile> fileList = marketDao.selectMarketFileList(marketNo);	//파일 리스트 조회
		m.setFileList(fileList);												//객체에 파일리스트 추가
		return m;
	}

	public Map<String, Object> selectLikeInfo(Integer marketNo, String token) {

		int likeCount = marketDao.selectLikeCount(marketNo); // 총 좋아요 수 조회
		// System.out.println("총 좋아요 수 확인 : " + likeCount);

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("likeCount", likeCount);
		if (token != null) {
			LoginMember loginMember = jwtUtil.checkToken(token);
			String memberId = loginMember.getMemberId();
			Map<String, Object> params = new HashMap<String, Object>(); // marketNo,memberId 를 담을 객체 (VO대신)
			params.put("marketNo", marketNo);
			params.put("memberId", memberId);
			int isLike = marketDao.selectIsLike(params);
			// System.out.println("나의 좋아요 상태 : "+isLike);
			result.put("isLike", isLike);
		} else {
			result.put("isLike", 0);
		}

		return result;
	}

	@Transactional // 좋아요 클릭
	public int likeOn(Integer marketNo, String token) {
		LoginMember loginMember = jwtUtil.checkToken(token);

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("marketNo", marketNo);
		params.put("memberId", loginMember.getMemberId());
		int result = marketDao.likeOn(params);
		return result;
	}

	@Transactional // 좋아요 해제
	public int likeOff(Integer marketNo, String token) {
		LoginMember loginMember = jwtUtil.checkToken(token);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("marketNo", marketNo);
		params.put("memberId", loginMember.getMemberId());
		int result = marketDao.likeOff(params);
		return result;
	}

	
	public List<String> getFilePath(Integer marketNo) {
		List<String> fileList = marketDao.getFilePath(marketNo);
		return fileList;
	}

	@Transactional
	public int deleteFileTbl(Integer marketNo) {
		int result = marketDao.deleteFileTbl(marketNo);
		return result;
	}
	
	@Transactional
	public int deleteOneMarket(Integer marketNo) {
		int result = marketDao.deleteOneMarket(marketNo);
		return result;
	}
	
}
