package kr.co.iei.member.model.service;

import java.io.File;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.utils.JwtUtils;

@Service
public class MemberService {

	@Autowired
	private MemberDao memberDao;

	@Autowired
	private BCryptPasswordEncoder bcrypt;

	@Autowired
	private JwtUtils jwtUtil;

	@Transactional
	public int insertMember(Member member) {
		String encPw = bcrypt.encode(member.getMemberPw());
		member.setMemberPw(encPw);

		int result = memberDao.insertMember(member);
		return result;
	}

	public Member selectOneMember(String memberId) {
		Member m = memberDao.selectOneMember(memberId);
		return m;
	}

	public LoginMember login(Member member) {
		Member loginMember = memberDao.selectOneMember(member.getMemberId());

		if (loginMember != null && bcrypt.matches(member.getMemberPw(), loginMember.getMemberPw())) {
			LoginMember login = jwtUtil.createToken(loginMember.getMemberId(), loginMember.getMemberGrade());
			login.setMemberThumb(loginMember.getMemberThumb());
			login.setMemberName(loginMember.getMemberName());

			return login;
		}
		return null;
	}

	public String findId(Member member) {
		String memberId = memberDao.findId(member);
		return memberId;
	}

	@Transactional
	public int updateTempPw(Member member) {
		// 회원가입떄 했던 암호화 로직 그대로 쓰기
		String encPw = bcrypt.encode(member.getMemberPw());
		member.setMemberPw(encPw);

		int result = memberDao.updateTempPw(member);
		return result;
	}

	public int updateThumbnail(Member m, String root) {
	    Member oldM = memberDao.selectOneMember(m.getMemberId());
	    String oldThumb = oldM.getMemberThumb();

	    int result = memberDao.updateThumbnail(m);

	    if (result == 1 && oldThumb != null) {
			System.out.println("delete");
	        deleteFile(oldThumb, root);
	    }

	    return result;
	}

	public int memberUpdate(String memberId, Member member, String root) {
		System.out.println("memberid:" + memberId);
		Member oldM = memberDao.selectOneMember(memberId);

		int result = memberDao.memberUpdate(member);

		if (result == 1 && oldM.getMemberThumb() != null 
		        && member.getMemberThumb() == null) {
			deleteFile(oldM.getMemberThumb(), root);
		}
		return result;
	}

	private boolean deleteFile(String filename, String root) {
		System.out.println(filename);
		if (filename == null || filename.isEmpty())
			return false;
		File file = new File(root + filename);
		System.out.println(file);
		System.out.println(file.exists());
		if (file.exists()) {
			return file.delete();
		}
		return false;
	}

	public int memberDelete(String memberId) {
		int result = memberDao.memberDelete(memberId);
		return result;
	}

	public int updatePw(Member member) {
		String encPw = bcrypt.encode(member.getMemberPw());
		member.setMemberPw(encPw);

		int result = memberDao.updatePw(member);
		return result;
	}

	/*
	 * public Member mypage(String memberId, String token) { try { LoginMember login
	 * = jwtUtil.checkToken(token); System.out.println(login); Member member =
	 * memberDao.selectOneMember(memberId); return member; } catch (Exception e) {
	 * // TODO: handle exception } return null; // 토큰 유효 시간 지났을 때 출력되는 부분 }
	 */

	// 멤버 프로필 변경

}