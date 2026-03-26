import { Link } from "react-router-dom";
import styles from "./Commons.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <div>
          <p>팀 4코리아(유) </p>
          <p>
            서울특별시 팀4 팀4로, 팀4대로 팀4타워 77층 (77777) | 팀장: 이영민
          </p>
          <p>
            사업자 등록번호: 010-9274-1409 | 개인정보관리책임자: 이영민 |
            호스팅서비스사업자: 팀4코리아(유)
          </p>
          <p>고객센터: 9274-1409 | 이메일: yglee0248@gmail.com</p>
        </div>
        <div className={styles.sns}>
          <span class="material-icons">language</span>
          <span class="material-icons">language</span>
          <span class="material-icons">language</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
