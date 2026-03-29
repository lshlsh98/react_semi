import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/font/font.css";
import Footer from "./components/commons/Footer";
import Header from "./components/commons/Header";
import Join from "./pages/member/Join";
import Login from "./pages/member/Login";

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="main">
        <Routes>
          <Route path="/member/join" element={<Join />} />
          <Route path="/member/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
