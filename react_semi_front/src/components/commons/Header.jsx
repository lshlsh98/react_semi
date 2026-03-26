import { Link } from "react-router-dom";
import styles from "./Commons.module.css";
import Button from "../ui/Button";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.main_header}>
        <div className={styles.site_logo}>
          <Link to="/">C2C</Link>
        </div>
        <div className={styles.member_link_zone}>
          <Button
            className="btn primary"
            onClick={() => {
              navigete("/member/login");
            }}
          >
            로그인
          </Button>
          <Button
            className="btn primary"
            onClick={() => {
              navigete("/member/join");
            }}
          >
            회원가입
          </Button>
        </div>
      </div>
      <div className={styles.nav}>
        <ul>
          <Link to="/">
            <li>중고거래</li>
          </Link>
          <Link to="/">
            <li>커뮤니티</li>
          </Link>
          <Link to="/">
            <li>API</li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
