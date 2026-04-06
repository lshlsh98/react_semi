import { useState } from "react";
import styles from "./Mypage.module.css";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import MemberInfo from "../../components/mypage/MemberInfo";
import MyCommunityPage from "../../components/mypage/MyCommunityPage";
import Swal from "sweetalert2";
import useAuthStore from "../../components/utils/useAuthStore";
import ChangePw from "../../components/mypage/ChangePw";
import MyMarketPage from "../../components/mypage/MyMarketPage";
import MyCommunityCommentPage from "../../components/mypage/MyCommunityCommentPage";
import MyMarketCommentPage from "../../components/mypage/MyMarketCommentPage";
import LikeDislike from "../../components/mypage/LikeDislike";

const Mypage = () => {
  const navigate = useNavigate();
  const { memberId, isReady, isNotLogout } = useAuthStore();

  console.log(useAuthStore());

  if (isReady && memberId == null && !isNotLogout) {
    Swal.fire({
      title: "로그인 후 이용 가능합니다.",
      icon: "warning",
    }).then(() => {
      navigate("/member/login");
    });
    return;
  }

  return (
    memberId && (
      <div className={styles.mypage_wrap}>
        <div className={styles.sidebar_wrap}>
          <Profile></Profile>
          <SideBar></SideBar>
        </div>
        <div className={styles.mypage_content}>
          <Routes>
            <Route path="myinfo" element={<MemberInfo />} />
            <Route path="likedislike" element={<LikeDislike />} />
            <Route
              path="market/:isAdminMode"
              element={<MyMarketPage />}
            ></Route>
            <Route
              path="community/:isAdminMode"
              element={<MyCommunityPage />}
            ></Route>
            <Route
              path="marketcomment/:isAdminMode"
              element={<MyMarketCommentPage />}
            ></Route>
            <Route
              path="communitycomment/:isAdminMode"
              element={<MyCommunityCommentPage />}
            ></Route>
            <Route path="pw" element={<ChangePw />} />
          </Routes>
        </div>
      </div>
    )
  );
};

const Profile = () => {
  const { memberId, memberName, memberThumb } = useAuthStore();

  return (
    <div className={styles.sidebar}>
      <div
        className={
          memberThumb ? styles.member_thumb_exists : styles.member_thumb
        }
      >
        {memberThumb ? (
          <img src={`${import.meta.env.VITE_BACKSERVER}/semi/${memberThumb}`} />
        ) : (
          <span className="material-icons">account_circle</span>
        )}
      </div>
      <div className={styles.profile_info}>
        <p>{memberName}</p>
        <p>{memberId}</p>
      </div>
    </div>
  );
};

const SideBar = () => {
  const { memberGrade } = useAuthStore();

  const [selectMenu, setSelectMenu] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className={styles.sidebar}>
      <ul>
        <NavLink to="/member/mypage/myinfo">
          <li
            className={selectMenu === "myinfo" ? styles.active : ""}
            onClick={() => setSelectMenu("myinfo")}
          >
            내 정보
          </li>
        </NavLink>
        <NavLink to="/member/mypage/pw">
          <li
            className={selectMenu === "pw" ? styles.active : ""}
            onClick={() => setSelectMenu("pw")}
          >
            비밀번호 변경
          </li>
        </NavLink>
        {/* <li
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
        </li> */}
        <NavLink to="/member/mypage/likedislike">
          <li
            className={selectMenu === "likedislike" ? styles.active : ""}
            onClick={() => setSelectMenu("likedislike")}
          >
            좋아요 / 싫어요 기록
          </li>
        </NavLink>
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
            <NavLink to={`/member/mypage/market/${false}`}>
              <li
                className={
                  selectMenu === "postManagement_trade" ? styles.active : ""
                }
                onClick={() => setSelectMenu("postManagement_trade")}
              >
                거래
              </li>
            </NavLink>
            <NavLink to={`/member/mypage/community/${false}`}>
              <li
                className={
                  selectMenu === "postManagement_community" ? styles.active : ""
                }
                onClick={() => setSelectMenu("postManagement_community")}
              >
                커뮤니티
              </li>
            </NavLink>
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
            <NavLink to={`/member/mypage/marketcomment/${false}`}>
              <li
                className={
                  selectMenu === "commentManagement_trade" ? styles.active : ""
                }
                onClick={() => setSelectMenu("commentManagement_trade")}
              >
                거래
              </li>
            </NavLink>
            <NavLink to={`/member/mypage/communitycomment/${false}`}>
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
            </NavLink>
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

      {memberGrade !== 3 && (
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
            className={
              selectMenu === "postManagement_admin" ||
              selectMenu === "postManagement_trade_admin" ||
              selectMenu === "postManagement_community_admin"
                ? styles.active
                : ""
            }
          >
            <div
              className={styles.menu_title}
              onClick={() => {
                toggleMenu("postManagement_admin");
                setSelectMenu("postManagement_admin");
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
            <ul
              className={openMenu === "postManagement_admin" ? styles.open : ""}
            >
              <NavLink to={`/member/mypage/market/${true}`}>
                <li
                  className={
                    selectMenu === "postManagement_trade_admin"
                      ? styles.active
                      : ""
                  }
                  onClick={() => setSelectMenu("postManagement_trade_admin")}
                >
                  거래
                </li>
              </NavLink>
              <NavLink to={`/member/mypage/community/${true}`}>
                <li
                  className={
                    selectMenu === "postManagement_community_admin"
                      ? styles.active
                      : ""
                  }
                  onClick={() =>
                    setSelectMenu("postManagement_community_admin")
                  }
                >
                  커뮤니티
                </li>
              </NavLink>
            </ul>
          </li>
          <li
            className={
              selectMenu === "commentManagement_admin" ||
              selectMenu === "commentManagement_trade_admin" ||
              selectMenu === "commentManagement_community_admin"
                ? styles.active
                : ""
            }
          >
            <div
              className={styles.menu_title}
              onClick={() => {
                toggleMenu("commentManagement_admin");
                setSelectMenu("commentManagement_admin");
              }}
            >
              <span
                className={`material-icons ${styles.arrow} ${
                  openMenu === "commentManagement_admin" ? styles.rotate : ""
                }`}
              >
                chevron_right
              </span>
              댓글 관리
            </div>
            <ul
              className={
                openMenu === "commentManagement_admin" ? styles.open : ""
              }
            >
              <NavLink to={`/member/mypage/marketcomment/${true}`}>
                <li
                  className={
                    selectMenu === "commentManagement_trade_admin"
                      ? styles.active
                      : ""
                  }
                  onClick={() => setSelectMenu("commentManagement_trade_admin")}
                >
                  거래
                </li>
              </NavLink>
              <NavLink to={`/member/mypage/communitycomment/${true}`}>
                <li
                  className={
                    selectMenu === "commentManagement_community_admin"
                      ? styles.active
                      : ""
                  }
                  onClick={() =>
                    setSelectMenu("commentManagement_community_admin")
                  }
                >
                  커뮤니티
                </li>
              </NavLink>
            </ul>
          </li>
          <li
            onClick={() => {
              toggleMenu("reportedPostManagement");
              setSelectMenu("reportedPostManagement");
            }}
            className={
              selectMenu === "reportedPostManagement" ? styles.active : ""
            }
          >
            거래 현황
          </li>
        </ul>
      )}
    </div>
  );
};

export default Mypage;
