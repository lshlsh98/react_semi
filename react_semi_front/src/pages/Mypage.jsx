import { useState } from "react";
import styles from "./Mypage.module.css";
import { NavLink, Route, Routes } from "react-router-dom";

const Mypage = () => {
  return (
    <div className={styles.mypage_wrap}>
      <div className={styles.sidebar_wrap}>
        <Profile></Profile>
        <SideBar></SideBar>
        <Routes>
          <Route path="myinfo" element></Route>
        </Routes>
      </div>
    </div>
  );
};

const Profile = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.profile_img}>
        <span class="material-icons">account_circle</span>
      </div>
      <div className={styles.profile_info}>
        <p>이름</p>
        <p>아이디</p>
      </div>
    </div>
  );
};

const SideBar = () => {
  const [selectMenu, setSelectMenu] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className={styles.sidebar}>
      <ul>
        {/* 링크 부분 수정 */}
        <NavLink to="member/mypage/myinfo">
          <li
            className={selectMenu === "myinfo" ? styles.active : ""}
            onClick={() => setSelectMenu("myinfo")}
          >
            내 정보
          </li>
        </NavLink>
        <li
          className={selectMenu === "pw" ? styles.active : ""}
          onClick={() => setSelectMenu("pw")}
        >
          비밀번호 변경
        </li>
        <li
          className={
            selectMenu === "likehate" ||
            selectMenu === "likehate_trade" ||
            selectMenu === "likehate_community"
              ? styles.active
              : ""
          }
        >
          <div
            className={styles.menu_title}
            onClick={() => {
              toggleMenu("likehate");
              setSelectMenu("likehate");
            }}
          >
            <span
              className={`material-icons ${styles.arrow} ${
                openMenu === "likehate" ? styles.rotate : ""
              }`}
            >
              chevron_right
            </span>
            좋아요 / 싫어요 기록
          </div>
          <ul className={openMenu === "likehate" ? styles.open : ""}>
            <li
              className={selectMenu === "likehate_trade" ? styles.active : ""}
              onClick={() => setSelectMenu("likehate_trade")}
            >
              거래
            </li>
            <li
              className={
                selectMenu === "likehate_community" ? styles.active : ""
              }
              onClick={() => setSelectMenu("likehate_community")}
            >
              커뮤니티
            </li>
          </ul>
        </li>
        <li
          className={
            selectMenu === "postManagement" ||
            selectMenu === "postManagement_trade" ||
            selectMenu === "postManagement_community"
              ? styles.active
              : ""
          }
        >
          <div
            className={styles.menu_title}
            onClick={() => {
              toggleMenu("postManagement");
              setSelectMenu("postManagement");
            }}
          >
            <span
              className={`material-icons ${styles.arrow} ${
                openMenu === "postManagement" ? styles.rotate : ""
              }`}
            >
              chevron_right
            </span>
            게시글 관리
          </div>
          <ul className={openMenu === "postManagement" ? styles.open : ""}>
            <li
              className={
                selectMenu === "postManagement_trade" ? styles.active : ""
              }
              onClick={() => setSelectMenu("postManagement_trade")}
            >
              거래
            </li>
            <li
              className={
                selectMenu === "postManagement_community" ? styles.active : ""
              }
              onClick={() => setSelectMenu("postManagement_community")}
            >
              커뮤니티
            </li>
          </ul>
        </li>
        <li
          className={
            selectMenu === "commentManagement" ||
            selectMenu === "commentManagement_trade" ||
            selectMenu === "commentManagement_community"
              ? styles.active
              : ""
          }
        >
          <div
            className={styles.menu_title}
            onClick={() => {
              toggleMenu("commentManagement");
              setSelectMenu("commentManagement");
            }}
          >
            <span
              className={`material-icons ${styles.arrow} ${
                openMenu === "commentManagement" ? styles.rotate : ""
              }`}
            >
              chevron_right
            </span>
            댓글 관리
          </div>
          <ul className={openMenu === "commentManagement" ? styles.open : ""}>
            <li
              className={
                selectMenu === "commentManagement_trade" ? styles.active : ""
              }
              onClick={() => setSelectMenu("commentManagement_trade")}
            >
              거래
            </li>
            <li
              className={
                selectMenu === "commentManagement_community"
                  ? styles.active
                  : ""
              }
              onClick={() => setSelectMenu("commentManagement_community")}
            >
              커뮤니티
            </li>
          </ul>
        </li>
        <li
          onClick={() => {
            toggleMenu("Contribution");
            setSelectMenu("Contribution");
          }}
          className={selectMenu === "Contribution" ? styles.active : ""}
        >
          나의 탄소 기여도
        </li>
      </ul>

      <ul className={styles.management}>
        <li>관리 페이지</li>
        <li
          onClick={() => {
            toggleMenu("memberManagement");
            setSelectMenu("memberManagement");
          }}
          className={selectMenu === "memberManagement" ? styles.active : ""}
        >
          회원 관리
        </li>
        <li
          onClick={() => {
            toggleMenu("postManage");
            setSelectMenu("postManage");
          }}
          className={selectMenu === "postManage" ? styles.active : ""}
        >
          신고된 게시글 확인
        </li>
      </ul>
    </div>
  );
};

export default Mypage;
