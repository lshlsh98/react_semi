package kr.co.iei.community.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="community")
public class Community {
	private Integer communityNo;		// 커뮤니티 글 번호
	private String communityTitle;		// 제목
	private String communityContent;	// 내용
	private String communityDate;		// 작성일
	private Integer communityStatus;		// 글 공개 여부 (1:공개 2:비공개)
	private String communityWriter; 	// 글 작성자
	private Integer viewCount;			// 조회수
}
