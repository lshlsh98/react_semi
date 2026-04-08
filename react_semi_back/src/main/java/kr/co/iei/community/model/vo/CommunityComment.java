package kr.co.iei.community.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="communityComment")
public class CommunityComment {
	private Integer communityCommentNo;			// 댓글 번호
	private String communityCommentContent;		// 댓글 내용
	private String communityCommentDate;		// 댓글 작성일
	private Integer communityNo;				// 커뮤니티 글 번호
	private String communityCommentWriter;		// 댓글 작성자
	private Integer communityCommentNo2;		// 대댓글 (부모: Null, 자식: 부모의 commentNo;)
}
