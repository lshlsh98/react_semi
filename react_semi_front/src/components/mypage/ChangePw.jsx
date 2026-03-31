import { useState } from "react";
import Button from "../ui/Button";
import { Input } from "../ui/Form";
import useAuthStore from "../utils/useAuthStore";
import styles from "./ChangePw.module.css";

const ChangePw = () => {
  const { memberId, memberThumb } = useAuthStore();
  const [member, setMember] = useState(null);
  const [memberAuth, setMemberAuth] = useState({
    memberId: "",
    memberPw: "",
  });
  const [memberAuthSuccess, setMemberAuthSuccess] = useState(false);

  const inputMember = (e) => {
    setMemberAuth({ ...memberAuth, [e.target.name]: e.target.value });
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
          <div className={styles.member_auth_pw}>
            <p>비밀번호</p>
            <Input
              type="password"
              name="memberPw"
              id="memberPw"
              placeholder="비밀번호를 입력하세요."
              value={memberAuth.memberPw}
              onChange={inputMember}
            ></Input>
          </div>
          <Button type="submit" className="btn primary lg">
            내 정보 수정
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePw;
