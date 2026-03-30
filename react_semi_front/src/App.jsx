import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/font/font.css";
import Footer from "./components/commons/Footer";
import Header from "./components/commons/Header";
import Join from "./pages/member/Join";
import Login from "./pages/member/Login";
import Mypage from "./pages/Mypage";
import CommunityWritePage from "./pages/community/CommunityWritePage";
import Find_id from "./pages/member/Find_id";

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/member/join" element={<Join />} />
          <Route path="/member/login" element={<Login />} />
          <Route path="/member/find-id" element={<Find_id />} />

          <Route path="/member/mypage/*" element={<Mypage />} />
          <Route path="/community/write" element={<CommunityWritePage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
