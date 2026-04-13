import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/font/font.css";
import Footer from "./components/commons/Footer";
import Header from "./components/commons/Header";
import Join from "./pages/member/Join";
import Login from "./pages/member/Login";
import Mypage from "./pages/mypage/Mypage";
import CommunityWritePage from "./pages/community/CommunityWritePage";
import Find_id from "./pages/member/Find_id";
import MarketListPage from "./pages/market/MarketListPage";
import MarketWritePage from "./pages/market/MarketWritePage";
import MarketViewPage from "./pages/market/MarketViewPage";
import Find_pw from "./pages/member/Find_pw";
import axios from "axios";
import useAuthStore from "./components/utils/useAuthStore";
import { useEffect } from "react";
import Map from "./pages/map/Map";
import CommunityListPage from "./pages/community/CommunityListPage";
import MainPage from "./pages/main/MainPage";
import CommunityModifyPage from "./pages/community/CommunityModifyPage";
import CommunityViewPage from "./pages/community/CommunityViewPage";
import MarketModifyPage from "./pages/market/MarketModifyPage";

function App() {
  const { endTime, token } = useAuthStore(); // endTime = 만료시간, token = 걍 토큰

  const logout = () => {
    // logout 함수 상태 비우기 + axios 헤더 비우기
    useAuthStore.getState().logout();
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    useAuthStore.getState().setReady(true); // 앱 준비중

    if (endTime === null) {
      // 로그인된 상태가 아니면 타이머 안돌림
      return;
    }
    const timeout = endTime - Date.now(); // 남은 시간 = 만료시간 - 현재시간

    if (timeout > 0) {
      axios.defaults.headers.common["Authorization"] = token; // axios가 서버에 요청 보낼때마다 토큰을 달고 가도록 세팅

      window.setTimeout(() => {
        // useEffect처럼(똑같진 않음, if(time > 0)이쪽에 걸려있음) timeout값을 계속 갱신하다가 0이 되면 자동으로 logout하고 if문 나가게함.
        logout();
      }, timeout);
    } else {
      // 쓰레기 토큰 파기 (로그아웃 처리함, 예 : 어제 로그인하고 오늘 켰을떄 등)
      logout();
    }
  }, [endTime]); // endTime이 바뀔때마다 (로그인 / 로그아웃) useEffect함수 실행

  return (
    <div className="wrap">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/member/join" element={<Join />} />
          <Route path="/member/login" element={<Login />} />
          <Route path="/member/find-id" element={<Find_id />} />
          <Route path="/member/find-pw" element={<Find_pw />} />
          <Route path="/map" element={<Map />} />
          <Route path="/community" element={<CommunityListPage />} />

          {/* 진호 */}
          <Route path="/market" element={<MarketListPage />} />
          <Route path="/market/writeFrm" element={<MarketWritePage />} />
          <Route path="/market/view/:marketNo" element={<MarketViewPage />} />
          <Route
            path="/market/modify/:marketNo"
            element={<MarketModifyPage />}
          />

          <Route path="/member/mypage/*" element={<Mypage />} />

          <Route path="/community" element={<CommunityListPage />} />
          <Route path="/community/write" element={<CommunityWritePage />} />
          <Route
            path="/community/view/:communityNo"
            element={<CommunityViewPage />}
          />
          <Route
            path="/community/modify/:communityNo"
            element={<CommunityModifyPage />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
