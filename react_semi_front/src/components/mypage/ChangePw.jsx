import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { Input } from "../ui/Form";
import useAuthStore from "../utils/useAuthStore";
import styles from "./ChangePw.module.css";
import axios from "axios";

const ChangePw = () => {
  const { memberId, memberThumb } = useAuthStore();
  const [member, setMember] = useState(null);
  const [memberAuth, setMemberAuth] = useState({
    memberId: "",
    memberPw: "",
  });
  const [memberAuthSuccess, setMemberAuthSuccess] = useState(false);

  const [newPw, setNewPw] = useState("");
  const [newPwRe, setNewPwRe] = useState("");

  const inputMember = (e) => {
    setMemberAuth({ ...memberAuth, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!memberId) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {
        setMemberAuth((prev) => ({ ...prev, memberId: res.data.memberId }));
        console.log(memberAuth);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const auth = () => {
    console.log(memberAuth);

    if (memberAuth.memberPw === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/pw-auth`, memberAuth)
      .then((res) => {
        console.log(memberAuth);
        setMemberAuthSuccess(true);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "인증 실패",
          text: "비밀번호를 확인하세요.",
        });
      });
  };

  return (
    <div className={styles.member_info_wrap}>
      <h3 className="page-title">내 정보</h3>
      <div className={styles.profile_info}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            auth();
          }}
          autoComplete="off"
        >
          <ul className={styles.member_auth_pw}>
            <li>
              <p>비밀번호</p>
            </li>
            <li>
              <Input
                type="password"
                name="memberPw"
                id="memberPw"
                placeholder="비밀번호를 입력하세요."
                value={memberAuth.memberPw}
                onChange={inputMember}
              ></Input>
            </li>
            <li>
              <Button type="submit" className="btn primary">
                비밀번호 확인
              </Button>
            </li>
          </ul>
        </form>
        {memberAuthSuccess && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            autoComplete="off"
          >
            <ul className={styles.member_new_pw}>
              <li>
                <p>새로운 비밀번호 입력</p>
              </li>
              <li>
                <Input
                  type="password"
                  name="memberPw"
                  id="memberPw"
                  placeholder="새로운 비밀번호를 입력하세요."
                  value={newPw}
                  onChange={(e) => {
                    setNewPw(e.target.value);
                  }}
                ></Input>
              </li>
              <li></li>
            </ul>
            <ul className={styles.member_new_pw}>
              <li>
                <p>새로운 비밀번호 확인</p>
              </li>
              <li>
                <Input
                  type="password"
                  name="memberPw"
                  id="memberPw"
                  placeholder="새로운 비밀번호를 입력하세요."
                  value={newPwRe}
                  onChange={(e) => {
                    setNewPwRe(e.target.value);
                  }}
                ></Input>
              </li>
              <li></li>
            </ul>
            <div className={styles.button_wrap}>
              <Button type="submit" className="btn primary lg">
                비밀번호 수정
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePw;
