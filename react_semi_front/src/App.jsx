import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/commons/Footer";
import Header from "./components/commons/Header";
import MarketListPage from "./pages/market/MarketListPage";

function App() {
  return (
    <div>
      <Header></Header>
      <div className="wrap"></div>
      <Routes>
        <Route path="/member/join" element={<Join />} />
        <Route path="/member/login" element={<Login />} />

        <Route path="/" />
        <Route path="/member/mypage/*" element={<Mypage />} />

        <Route path="/market" element={<MarketListPage />} />
      </Routes>

      <Footer></Footer>
    </div>
  );
}

export default App;
