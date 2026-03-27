import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/font/font.css";
import Footer from "./components/commons/Footer";
import Header from "./components/commons/Header";
import Mypage from "./pages/Mypage";

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/" />
          <Route path="/member/mypage/main" element={<Mypage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
