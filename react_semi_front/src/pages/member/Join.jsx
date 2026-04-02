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
  const detailRef = useRef(null); //카카오 맵으로 주소를 고르면 상세주소로 focus가 가게끔 하기위해 상세주소input에 이름표 달아두기용

  const [member, setMember] = useState({
    // member정보를 받을 state
    memberId: "",
    memberPw: "",
    memberName: "",
    memberEmail: "",
    memberPostcode: "",
    memberAddr: "",
    memberDetailAddr: "",
  });

  const [memberPwRe, setMemberPwRe] = useState(""); // 비밀번호 확인 value용 state

  const inputMember = (e) => {
    // 이젠 너무 익숙한 value에 있는 값을 member에 넣는 방법
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const [checkId, setCheckId] = useState(0); // 중복 확인용 state

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

  const [checkPw, setCheckPw] = useState(0); // 비밀번호 확인 맞는지 틀린지 보는용도 state

  const pwDupCheck = () => {
    if (member.memberPw === memberPwRe && member.memberPw !== "") {
      setCheckPw(1);
    } else {
      setCheckPw(2);
    }
  };

  const { open } = useKakaoPostcode({
    onComplete: (data) => {
      console.log(data); // 주소 찾기했을떄 그 주소에 대한 정보 쫙 뜨게 뭐있는지 확인용 (나중에 진짜로 서비스를 한다 생각하면 없애야함 그때 없애면 됨)

      setMember({
        ...member,
        memberPostcode: data.zonecode,
        memberAddr: data.roadAddress, // roadAddress : 도로명 주소
      });
      detailRef.current.focus();
    },
  });

  const [mailAuth, setMailAuth] = useState(0); // mail input의 상태(예:disable) 관리를 위한 state
  const [mailAuthCode, setMailAuthCode] = useState(null); // 서버에서 날아온 인증번호를 담는 용도의 state
  const [mailAuthInput, setMailAuthInput] = useState(""); // 사용자가 입력한 인증번호를 담는 용도의 state

  const [time, setTime] = useState(300); // 시간 300초로 설정하기
  const timerRef = useRef(null); // 시간을 state로만 관리하면 set으로 랜더링할때마다 시간이 깜빡깜빡하는데 화면 랜더링에 영향 없이 타이머(시간)를 담는 용도

  const sendMail = () => {
    if (member.memberEmail === "") {
      Swal.fire({
        icon: "warning",
        title: "이메일 입력",
        text: "이메일을 먼저 입력해주세요.",
      });
      return;
    }

    setTime(300);
    setMailAuthCode(null);
    if (timerRef.current) window.clearInterval(timerRef.current);

    setMailAuth(1);

    Swal.fire({ title: "메일 발송 중...", didOpen: () => Swal.showLoading() });

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-verification`, {
        memberEmail: member.memberEmail,
      })
      .then((res) => {
        console.log("인증코드:", res.data); // 인증코드 f12로 편하게 보는용 (나중에 지워야함.)
        Swal.fire({
          icon: "success",
          title: "발송 완료",
          text: "이메일로 인증번호가 발송되었습니다.",
        });
        setMailAuthCode(res.data);
        setMailAuth(2);

        // 인증코드 인증시간이 넘었을때를 위해
        timerRef.current = window.setInterval(() => {
          setTime((prev) => {
            if (prev <= 1) {
              window.clearInterval(timerRef.current);
              Swal.fire({
                icon: "warning",
                title: "시간 초과",
                text: "인증 시간이 만료되었습니다. 다시 시도해주세요.",
              });
              setMailAuthCode(null);
              setMailAuth(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "발송 실패",
          text: "이메일 발송에 실패했습니다. 입력하신 이메일을 확인해주세요!",
        });
        setMailAuth(0);
      });
  };

  // 분 : 초 세팅
  const showTime = () => {
    const min = Math.floor(time / 60);
    const sec = String(time % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // 위에서부터 순서대로 체크해서 alert띄우기
  const joinMember = () => {
    if (checkId !== 2) {
      Swal.fire({
        icon: "warning",
        title: "확인 필요",
        text: "아이디 중복 체크를 해주세요.",
      });
      return;
    }
    if (checkPw !== 1) {
      Swal.fire({
        icon: "warning",
        title: "확인 필요",
        text: "비밀번호 일치 확인을 해주세요.",
      });
      return;
    }
    if (member.memberName === "") {
      Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "이름(닉네임)을 입력하세요.",
      });
      return;
    }
    if (mailAuth !== 3) {
      Swal.fire({
        icon: "warning",
        title: "인증 필요",
        text: "이메일 인증을 완료해주세요.",
      });
      return;
    }
    if (member.memberPostcode === "" || member.memberDetailAddr === "") {
      Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "주소를 입력해주세요.",
      });
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
                <div className={styles.timer_wrap}>
                  <Input
                    type="text"
                    name="mailAuthInput"
                    id="mailAuthInput"
                    placeholder="이메일에 도착한 인증코드를 입력하세요."
                    value={mailAuthInput}
                    onChange={(e) => setMailAuthInput(e.target.value)}
                    disabled={mailAuth === 3}
                  />
                  {mailAuth !== 3 && (
                    <span className={styles.timer_text}>{showTime()}</span>
                  )}
                </div>

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
                      Swal.fire({
                        icon: "success",
                        title: "인증 성공",
                        text: "이메일 인증이 완료되었습니다.",
                      });
                    } else {
                      Swal.fire({
                        icon: "error",
                        title: "인증 실패",
                        text: "인증코드가 올바르지 않습니다.",
                      });
                    }
                  }}
                >
                  인증하기
                </Button>
              </div>

              {mailAuth === 3 && (
                <p className={`${styles.validation_msg} ${styles.valid}`}>
                  인증되었습니다.
                </p>
              )}
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
