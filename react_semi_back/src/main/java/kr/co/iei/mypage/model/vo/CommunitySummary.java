package kr.co.iei.mypage.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Alias(value="communitySummary")
public class CommunitySummary {
	
	private Integer communityNo;
	private String title;
	private String writerId;
	private String writerName;
	private String contentDate;
	private Integer contentStatus;
	private Integer viewCount;
	private Integer likeCount;
	private Integer dislikeCount;
	private Integer commentCount;
	private Integer reportCount;
	private Integer isLiked;
	private Integer isDisliked;
	private Integer isCommented;
	private Integer isReported;
}
