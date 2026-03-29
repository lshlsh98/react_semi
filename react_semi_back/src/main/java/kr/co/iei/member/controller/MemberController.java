package kr.co.iei.member.controller;

import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.utils.EmailSender;

@CrossOrigin(value="*")
@RestController
@RequestMapping(value="/members")
public class MemberController {

    @Autowired
    private MemberService memberService;
    
    @Autowired
    private EmailSender sender;
    
    // 1. 회원가입
    @PostMapping
    public ResponseEntity<?> joinMember(@RequestBody Member member){
        int result = memberService.insertMember(member);
        return ResponseEntity.ok(result);
    }
    
    // 2. 아이디 중복체크
    @GetMapping(value="/exists")
    public ResponseEntity<?> dupCheckId(@RequestParam String memberId){
        Member m = memberService.selectOneMember(memberId);
        return ResponseEntity.ok(m == null);
    }
    
    // 3. 이메일 인증
    @PostMapping(value="/email-verification")
    public ResponseEntity<?> sendMail(@RequestBody Map<String, String> requestData){
        String emailTitle = "C2C 회원가입 이메일 인증번호입니다.";
        
        String receiverEmail = requestData.get("memberEmail");
        
        Random r = new Random();
        StringBuffer sb = new StringBuffer();
        for(int i=0; i<6; i++) {
        	//영어 대문자 / 영어 소문자 / 숫자 를 조합해서 6자리 랜덤코드 생성
			//숫자(0~9) : r.nextInt(10);
			//대문자(A~Z) : r.nextInt(26) + 65;
			//소문자(a~z) : r.nextInt(26) + 97; -> 유니코드 안외워지니 걍 구글에 유니코드 알파벳 몇번부터인지 체크 ㄱ
        	
            int flag = r.nextInt(3);    //0, 1, 2 -> 숫자, 대문자, 소문자 어떤걸 추출할지 랜덤으로 결정
            if(flag == 0) {
                sb.append(r.nextInt(10));
            }else if(flag == 1) {
                sb.append((char)(r.nextInt(26) + 65)); 
            }else if(flag == 2) {
                sb.append((char)(r.nextInt(26) + 97)); 
            }
        }
        String authCode = sb.toString();
        
        String emailContent = "<h1>안녕하세요. C2C(Customer To Carbon) 입니다.</h1>"
                            + "<h3>인증번호는 [<b>" + authCode + "</b>] 입니다.</h3>"
                            + "<h3>화면으로 돌아가 인증번호를 입력해 주세요.</h3>";
        
        sender.sendMail(emailTitle, receiverEmail, emailContent);
        return ResponseEntity.ok(authCode);
    }
    
    // 4. 로그인
    @PostMapping(value="/login")
    public ResponseEntity<?> login(@RequestBody Member member){
        LoginMember loginMember = memberService.login(member);
        
        if(loginMember == null) {
            return ResponseEntity.status(404).build();
        }else {
            return ResponseEntity.ok(loginMember); 
        }
    }
}