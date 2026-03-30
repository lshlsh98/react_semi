import { useRef, useState } from "react";
import styles from "./Join.module.css";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useKakaoPostcode } from "@clroot/react-kakao-postcode";

const Join = () => {
  const navigate = useNavigate();
  const detailRef = useRef(null);

  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberEmail: "",
    memberPostcode: "",
    memberAddr: "",
    memberDetailAddr: "",
  });

  const [memberPwRe, setMemberPwRe] = useState("");

  const inputMember = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const [checkId, setCheckId] = useState(0);

  const idDupCheck = () => {
    if (member.memberId === "") return;
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/members/exists?memberId=${member.memberId}`,
      )
      .then((res) => {
        if (res.data) {
          setCheckId(2);
        } else {
          setCheckId(1);
        }
      })
      .catch((err) => console.log(err));
  };

  const [checkPw, setCheckPw] = useState(0);

  const pwDupCheck = () => {
    if (member.memberPw === memberPwRe && member.memberPw !== "") {
      setCheckPw(1);
    } else {
      setCheckPw(2);
    }
  };

  const { open } = useKakaoPostcode({
    onComplete: (data) => {
      console.log(data);

      setMember({
        ...member,
        memberPostcode: data.zonecode,
        memberAddr: data.roadAddress,
      });
      detailRef.current.focus();
    },
  });

  const [mailAuth, setMailAuth] = useState(0);
  const [mailAuthCode, setMailAuthCode] = useState(null);
  const [mailAuthInput, setMailAuthInput] = useState("");

  const [time, setTime] = useState(180);
  const timerRef = useRef(null);

  const sendMail = () => {
    if (member.memberEmail === "") {
      alert("이메일을 입력하세요.");
      return;
    }

    setTime(180);
    setMailAuthCode(null);
    if (timerRef.current) window.clearInterval(timerRef.current);

    setMailAuth(1);

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-verification`, {
        memberEmail: member.memberEmail,
      })
      .then((res) => {
        console.log("인증코드:", res.data); // 나중에 없애야 하는 코드
        setMailAuthCode(res.data);
        setMailAuth(2);

        timerRef.current = window.setInterval(() => {
          setTime((prev) => {
            if (prev <= 1) {
              window.clearInterval(timerRef.current);
              setMailAuthCode(null);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  const showTime = () => {
    const min = Math.floor(time / 60);
    const sec = String(time % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const joinMember = () => {
    if (checkId !== 2) {
      alert("아이디 중복 체크를 해주세요.");
      return;
    }
    if (checkPw !== 1) {
      alert("비밀번호 일치 확인을 해주세요.");
      return;
    }
    if (member.memberName === "") {
      alert("이름(닉네임)을 입력하세요.");
      return;
    }
    if (mailAuth !== 3) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    if (member.memberPostcode === "" || member.memberDetailAddr === "") {
      alert("주소를 입력해주세요.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members`, member)
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            icon: "success",
            title: "가입 완료!",
            text: "Welcome to C2C!",
          });
          navigate("/member/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className={styles.join_section}>
      <div className={styles.join_card}>
        <h3 className={styles.page_title}>회원가입</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            joinMember();
          }}
          autoComplete="off"
        >
          <div className={styles.form_group}>
            <label htmlFor="memberId" className={styles.label}>
              아이디
            </label>
            <div className={styles.input_row}>
              <Input
                type="text"
                name="memberId"
                id="memberId"
                placeholder="ID를 입력하세요."
                value={member.memberId}
                onChange={inputMember}
                onBlur={idDupCheck}
              />
              <Button
                type="button"
                className="btn primary sm"
                onClick={idDupCheck}
              >
                아이디 중복 체크
              </Button>
            </div>
            {checkId > 0 && (
              <p
                className={`${styles.validation_msg} ${checkId === 2 ? styles.valid : styles.invalid}`}
              >
                {checkId === 2
                  ? "사용 가능한 아이디 입니다."
                  : "이미 사용중인 아이디 입니다."}
              </p>
            )}
          </div>

          <div className={styles.form_group}>
            <label htmlFor="memberPw" className={styles.label}>
              비밀번호
            </label>
            <div className={styles.input_row}>
              <Input
                type="password"
                name="memberPw"
                id="memberPw"
                placeholder="비밀번호를 입력하세요."
                value={member.memberPw}
                onChange={inputMember}
                onBlur={pwDupCheck}
              />
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="memberPwRe" className={styles.label}>
              비밀번호 확인
            </label>
            <div className={styles.input_row}>
              <Input
                type="password"
                name="memberPwRe"
                id="memberPwRe"
                placeholder="비밀번호를 다시 입력하세요."
                value={memberPwRe}
                onChange={(e) => setMemberPwRe(e.target.value)}
                onBlur={pwDupCheck}
              />
            </div>
            {checkPw > 0 && (
              <p
                className={`${styles.validation_msg} ${checkPw === 1 ? styles.valid : styles.invalid}`}
              >
                {checkPw === 1
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>

          <div className={styles.form_group}>
            <label htmlFor="memberName" className={styles.label}>
              이름 (닉네임)
            </label>
            <div className={styles.input_row}>
              <Input
                type="text"
                name="memberName"
                id="memberName"
                placeholder="이름을 입력하세요."
                value={member.memberName}
                onChange={inputMember}
              />
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="memberEmail" className={styles.label}>
              이메일 (E-Mail)
            </label>
            <div className={styles.input_row}>
              <Input
                type="email"
                name="memberEmail"
                id="memberEmail"
                placeholder="이메일을 입력하세요."
                value={member.memberEmail}
                onChange={inputMember}
                readOnly={mailAuth === 1 || mailAuth === 3}
              />
              <Button
                type="button"
                className="btn primary sm"
                onClick={sendMail}
                disabled={mailAuth === 1 || mailAuth === 3}
              >
                {mailAuth >= 2 ? "재전송" : "인증 코드 전송"}
              </Button>
            </div>
          </div>

          {mailAuth > 1 && (
            <div className={styles.form_group}>
              <label htmlFor="mailAuthInput" className={styles.label}>
                이메일 (E-Mail) - 인증코드
              </label>
              <div className={styles.input_row}>
                <Input
                  type="text"
                  name="mailAuthInput"
                  id="mailAuthInput"
                  placeholder="이메일에 도착한 인증코드를 입력하세요."
                  value={mailAuthInput}
                  onChange={(e) => setMailAuthInput(e.target.value)}
                  disabled={mailAuth === 3}
                />
                <Button
                  className="btn primary sm"
                  type="button"
                  disabled={mailAuth === 3}
                  onClick={() => {
                    if (
                      mailAuthCode === mailAuthInput &&
                      mailAuthInput !== ""
                    ) {
                      setMailAuth(3);
                      window.clearInterval(timerRef.current);
                    } else {
                      alert("인증코드가 올바르지 않습니다.");
                    }
                  }}
                >
                  인증하기
                </Button>
              </div>
              <p
                className={`${styles.validation_msg} ${mailAuth === 3 ? styles.valid : styles.invalid}`}
              >
                {mailAuth === 3 ? "인증되었습니다." : showTime()}
              </p>
            </div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="memberPostcode" className={styles.label}>
              주소
            </label>
            <div className={styles.input_row}>
              <Input
                type="text"
                name="memberPostcode"
                id="memberPostcode"
                placeholder="우편번호"
                value={member.memberPostcode}
                readOnly={true}
              />
              <Button type="button" className="btn primary sm" onClick={open}>
                주소 찾기
              </Button>
            </div>
          </div>

          <div className={`${styles.form_group} ${styles.addr_rows}`}>
            <div className={styles.input_row}>
              <Input
                type="text"
                name="memberAddr"
                id="memberAddr"
                placeholder="도로명주소"
                value={member.memberAddr}
                readOnly={true}
              />
            </div>
            <div className={styles.input_row}>
              <Input
                ref={detailRef}
                type="text"
                name="memberDetailAddr"
                id="memberDetailAddr"
                placeholder="상세주소를 입력하세요."
                value={member.memberDetailAddr}
                onChange={inputMember}
              />
            </div>
          </div>

          <div className={styles.final_button_wrap}>
            <Button type="submit" className="btn primary lg">
              회원 가입 완료
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Join;
