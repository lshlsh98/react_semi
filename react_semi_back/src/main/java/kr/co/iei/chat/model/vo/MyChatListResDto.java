package kr.co.iei.chat.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Alias("myChatListResDto")
public class MyChatListResDto {

	private Long roomId;
	private String roomName;
	private String isGroupChat;
	private Long unReadCount;
	
	private String myName;
	private String otherName;
	private Long marketNo;
}
