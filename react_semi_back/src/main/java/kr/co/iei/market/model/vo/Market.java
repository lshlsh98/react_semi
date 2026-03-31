package kr.co.iei.market.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="market")
public class Market {
	private Integer marketNo;		//번호
	private String marketTitle;		//제목
	private String marketContent;	//내용
	private String marketThumb;		//썸네일
	private String marketDate;		//작성일
	private Integer marketStatus;	//거래상태 (1:공개 2:비공개)
	private String marketWriter;	//작성자
	private Integer viewCount;		//조회수
	private String sellAddr;		//판매장소
	private Integer sellPrice;		//판매금액
	private Integer completed;		//완료	(0:미완료 1:완료)
	private String completedDate;	//거래완료시간
}
