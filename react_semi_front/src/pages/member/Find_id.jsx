import { useState } from "react";
import styles from "./Find_id.module.css";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

const Find_id = () => {
  const navigate = useNavigate();

  // 💡 상태 관리 추가
  const [member, setMember] = useState({ memberName: "", memberEmail: "" });
  const [authCode, setAuthCode] = useState(""); // 백엔드에서 날아온 정답 코드
  const [inputCode, setInputCode] = useState(""); // 사용자가 입력한 코드
  const [isSend, setIsSend] = useState(false); // 이메일 전송 여부
  const [isVerified, setIsVerified] = useState(false); // 인증 완료 여부

  const inputChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  // 💡 1. 이메일 전송 함수 (회원가입 백엔드 기능 재활용!)
  const sendMail = () => {
    if (member.memberEmail === "") {
      Swal.fire({
        icon: "warning",
        title: "이메일 입력",
        text: "이메일을 먼저 입력해주세요.",
      });
      return;
    }

    // 이메일 전송 중 로딩 띄우기 (선택사항)
    Swal.fire({ title: "메일 발송 중...", didOpen: () => Swal.showLoading() });

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-verification`, {
        memberEmail: member.memberEmail,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "발송 완료",
          text: "이메일로 인증번호가 발송되었습니다.",
        });
        setAuthCode(res.data); // 정답 저장
        setIsSend(true); // 입력창 열기
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "발송 실패",
          text: "이메일 발송에 실패했습니다.",
        });
      });
  };

  // 💡 2. 인증번호 확인 함수
  const verifyCode = () => {
    if (authCode === inputCode) {
      Swal.fire({
        icon: "success",
        title: "인증 성공",
        text: "이메일 인증이 완료되었습니다.",
      });
      setIsVerified(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "인증 실패",
        text: "인증번호가 일치하지 않습니다.",
      });
      setIsVerified(false);
    }
  };

  // 💡 3. 최종 아이디 찾기 요청
  const findIdAction = () => {
    if (member.memberName === "" || member.memberEmail === "") {
      alert("이름과 이메일을 모두 입력해주세요.");
      return;
    }
    if (!isVerified) {
      Swal.fire({
        icon: "warning",
        title: "인증 필요",
        text: "이메일 인증을 먼저 완료해주세요.",
      });
      return;
    }

    // (백엔드 /members/find-id 주소로 요청 - 이따 백엔드 만들 때 쓸 예정)
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/find-id`, member)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "아이디 찾기 성공",
          html: `회원님의 아이디는 <b>[ ${res.data} ]</b> 입니다.`,
          confirmButtonText: "로그인하러 가기",
        }).then((result) => {
          if (result.isConfirmed) navigate("/member/login");
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "조회 실패",
          text: "입력하신 정보와 일치하는 계정이 없습니다.",
        });
      });
  };

  return (
    <section className={styles.find_section}>
      <div className={styles.find_card}>
        {/* 왼쪽 패널 */}
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

        {/* 오른쪽 패널 */}
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
            {/* 이름 입력 */}
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
                disabled={isVerified}
              />
            </div>

            {/* 이메일 입력 + 인증버튼 */}
            <div className={styles.form_group}>
              <label htmlFor="memberEmail" className={styles.label}>
                이메일 (E-Mail)
              </label>
              <div className={styles.input_button_row}>
                <div className={styles.input_box}>
                  <Input
                    type="email"
                    name="memberEmail"
                    id="memberEmail"
                    placeholder="가입하신 이메일을 입력해주세요."
                    value={member.memberEmail}
                    onChange={inputChange}
                    disabled={isVerified}
                  />
                </div>
                <Button
                  type="button"
                  className="btn primary outline"
                  onClick={sendMail}
                  disabled={isVerified}
                >
                  {isSend ? "재전송" : "인증번호 받기"}
                </Button>
              </div>
            </div>

            {/* 인증번호 입력란 (메일 발송 후에만 보임) */}
            {isSend && !isVerified && (
              <div className={styles.form_group}>
                <div className={styles.input_button_row}>
                  <div className={styles.input_box}>
                    <Input
                      type="text"
                      name="inputCode"
                      id="inputCode"
                      placeholder="인증번호 6자리 입력"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    className="btn primary"
                    onClick={verifyCode}
                  >
                    인증하기
                  </Button>
                </div>
              </div>
            )}

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
