import styles from "./Mypage.module.css";

const Mypage = () => {
  return (
    <div className={styles.mypage_wrap}>
      <h3>사이드바</h3>
      <SideBar></SideBar>
    </div>
  );
};

const SideBar = () => {
  return (
    <div className={styles.sideBar}>
      <ul>
        <li>내 정보</li>
        <li>비밀번호 변경</li>
        <li>
          좋아요 / 싫어요 기록
          <ul>
            <li>거래</li>
            <li>커뮤니티</li>
          </ul>
        </li>
        <li>
          게시글 관리
          <ul>
            <li>거래</li>
            <li>커뮤니티</li>
          </ul>
        </li>
        <li>
          댓글 관리
          <ul>
            <li>거래</li>
            <li>커뮤니티</li>
          </ul>
        </li>
        <li>나의 탄소 기여도</li>
      </ul>

      <ul>
        <li>관리 페이지</li>
        <li>회원 관리</li>
        <li>신고된 게시글 확인</li>
      </ul>
    </div>
  );
};

export default Mypage;
