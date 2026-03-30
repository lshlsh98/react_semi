import { useState } from "react";
import styles from "./Find_id.module.css";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

const Find_id = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState({
    memberName: "",
    memberEmail: "",
  });

  const inputChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const findIdAction = () => {
    if (member.memberName === "" || member.memberEmail === "") {
      alert("이름과 이메일을 모두 입력해주세요.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/find-id`, member)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "아이디 찾기 성공",
          html: `회원님의 아이디는 <b>[ ${res.data} ]</b> 입니다.`,
          confirmButtonText: "로그인하러 가기",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/member/login");
          }
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "아이디 찾기 실패",
          text: "입력하신 정보와 일치하는 계정이 없습니다.",
        });
      });
  };

  return (
    <section className={styles.find_section}>
      <div className={styles.find_card}>
        <div className={styles.info_panel}>
          <h2 className={styles.welcome_title}>Welcome to</h2>
          <h1 className={styles.brand_title}>C2C</h1>
          <p className={styles.sub_title}>
            (Customer to Carbon)
            <br />
            지구를 구하는 작은 습관,
            <br />
            지금 동네에서 시작해보세요.
          </p>
        </div>

        <div className={styles.form_panel}>
          <h3 className={styles.page_title}>계정찾기</h3>

          <div className={styles.tab_menu}>
            <div className={`${styles.tab_item} ${styles.active}`}>
              아이디 찾기
            </div>
            <Link to="/member/find-pw" className={styles.tab_item}>
              비밀번호 찾기
            </Link>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              findIdAction();
            }}
          >
            <div className={styles.form_group}>
              <label htmlFor="memberName" className={styles.label}>
                이름
              </label>
              <Input
                type="text"
                name="memberName"
                id="memberName"
                placeholder="가입하신 이름을 입력하세요."
                value={member.memberName}
                onChange={inputChange}
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="memberEmail" className={styles.label}>
                이메일 (E-Mail)
              </label>
              <Input
                type="email"
                name="memberEmail"
                id="memberEmail"
                placeholder="가입하신 이메일을 입력해주세요."
                value={member.memberEmail}
                onChange={inputChange}
              />
            </div>

            <div className={styles.button_wrap}>
              <Button type="submit" className="btn primary lg">
                아이디 찾기
              </Button>
            </div>

            <div className={styles.login_link_wrap}>
              <span className={styles.helper_text}>기억나셨나요?</span>
              <Link to="/member/login" className={styles.login_link}>
                로그인하러가기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Find_id;
