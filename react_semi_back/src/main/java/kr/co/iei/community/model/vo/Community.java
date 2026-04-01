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
	private String communityTitle;		// 제목
	private String communityContent;	// 내용
}
