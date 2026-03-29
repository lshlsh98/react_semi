package kr.co.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;

@Service
public class MemberService {

    @Autowired
    private MemberDao memberDao;
    
    @Autowired
    private BCryptPasswordEncoder bcrypt;
    
    @Autowired
    private kr.co.iei.utils.JwtUtils jwtUtil; 
    
    @Transactional
    public int insertMember(Member member) {
        String encPw = bcrypt.encode(member.getMemberPw());
        member.setMemberPw(encPw);
        
        return memberDao.insertMember(member);
    }

    public Member selectOneMember(String memberId) {
        return memberDao.selectOneMember(memberId);
    }
    
    public LoginMember login(Member member) {
        Member loginMember = memberDao.selectOneMember(member.getMemberId());
        
        if(loginMember != null && bcrypt.matches(member.getMemberPw(), loginMember.getMemberPw())) {
            LoginMember login = jwtUtil.createToken(loginMember.getMemberId(), loginMember.getMemberGrade());
            login.setMemberThumb(loginMember.getMemberThumb());
            login.setMemberName(loginMember.getMemberName()); 
            
            return login;
        }
        return null; 
    }
}