package kr.co.iei.member.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginMember {
    private String token;
    private String memberId;
    private Integer memberGrade;
    private String memberThumb;
    private String memberAddr;	//마켓게시판 글작성시 필요
    private Long endTime;
    private String memberName; 
}