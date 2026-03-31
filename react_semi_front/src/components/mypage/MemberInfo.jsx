import styles from "./MemberInfo.module.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../utils/useAuthStore";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input } from "../ui/Form";
import Button from "../ui/Button";
import Swal from "sweetalert2";
import { useKakaoPostcode } from "@clroot/react-kakao-postcode";

const MemberInfo = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const detailRef = useRef(null);

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

  useEffect(() => {
    if (!memberId) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {
        console.log(res.data);
        setMember(res.data);
        setMemberAuth((prev) => ({ ...prev, memberId: res.data.memberId }));
        console.log(memberAuth);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const auth = () => {
    console.log(memberAuth);
    console.log(memberThumb);

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

  const changeThumb = (e) => {
    const file = inputRef.current.files && inputRef.current.files[0];
    if (!file) {
      return;
    }
    const form = new FormData();
    form.append("file", file);
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/members/${memberId}/thumbnail/update`,
        form,
        { headers: { "content-Type": "multipart/form-data" } },
      )
      .then((res) => {
        console.log(res);
        useAuthStore.getState().setThumb(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteThumb = (e) => {
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/members/${memberId}/thumbnail/delete`,
      )
      .then((res) => {
        console.log(res);
        useAuthStore.getState().setThumb(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const memberUpdate = () => {
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/members/${member.memberId}`,
        member,
      )
      .then((res) => {
        Swal.fire({ title: "수정완료" });
        useAuthStore.getState().setName(res.data);
        navigate("/member/mypage");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.member_info_wrap}>
      <h3 className="page-title">내 정보</h3>

      {member !== null && memberAuthSuccess ? (
        <div className={styles.profile_info_update}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              memberUpdate();
            }}
            autoComplete="off"
          >
            <div className={styles.member_thumb_wrap}>
              <label htmlFor="memberThumb">프로필 이미지</label>
              <div className={styles.member_thumb_img_wrap}>
                <div
                  className={
                    memberThumb
                      ? styles.member_thumb_exists
                      : styles.member_thumb
                  }
                >
                  {memberThumb ? (
                    <img
                      src={`${import.meta.env.VITE_BACKSERVER}/semi/${memberThumb}`}
                    />
                  ) : (
                    <span class="material-icons">account_circle</span>
                  )}
                </div>
                <Button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    inputRef.current.click();
                  }}
                >
                  이미지 변경
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  style={{ display: "none" }}
                  onChange={changeThumb}
                ></input>
                <Button
                  type="button"
                  className="btn primary"
                  onClick={deleteThumb}
                >
                  이미지 제거
                </Button>
              </div>
            </div>
            <ul className={`${styles.info_input_wrap} ${styles.member_name}`}>
              <li>
                <label htmlFor="memberName">이름</label>
              </li>
              <li>
                <Input
                  type="text"
                  name="memberName"
                  id="memberName"
                  value={member.memberName}
                  onChange={(e) => {
                    setMember({ ...member, memberName: e.target.value });
                  }}
                ></Input>
              </li>
            </ul>
            <ul className={`${styles.info_input_wrap} ${styles.member_id}`}>
              <li>
                <label htmlFor="memberId">아이디</label>
              </li>
              <li>
                <Input
                  type="text"
                  name="memberId"
                  id="memberId"
                  value={member.memberId}
                  readOnly={true}
                ></Input>
              </li>
            </ul>
            <ul className={`${styles.info_input_wrap} ${styles.member_email}`}>
              <li>
                <label htmlFor="memberEmail">이메일</label>
              </li>
              <li>
                <Input
                  type="text"
                  name="memberEmail"
                  id="memberEmail"
                  value={member.memberEmail}
                ></Input>
              </li>
            </ul>
            <ul
              className={`${styles.info_input_wrap} ${styles.member_postcode}`}
            >
              <li>
                <label htmlFor="memberPostcode">우편번호</label>
              </li>
              <li>
                <Input
                  type="text"
                  name="memberPostcode"
                  id="memberPostcode"
                  value={member.memberPostcode}
                  readOnly={true}
                ></Input>
              </li>
              <li>
                <Button type="button" className="btn primary" onClick={open}>
                  주소 찾기
                </Button>
              </li>
            </ul>
            <ul className={`${styles.info_input_wrap} ${styles.member_addr}`}>
              <li>
                <label htmlFor="memberAddr">도로명주소</label>
              </li>
              <li>
                <Input
                  type="text"
                  name="memberAddr"
                  id="memberAddr"
                  value={member.memberAddr}
                  readOnly={true}
                ></Input>
              </li>
            </ul>
            <ul
              className={`${styles.info_input_wrap} ${styles.member_detail_addr}`}
            >
              <li>
                <label htmlFor="memberDetailAddr">상세주소</label>
              </li>
              <li>
                <Input
                  type="text"
                  name="memberDetailAddr"
                  id="memberDetailAddr"
                  value={member.memberDetailAddr}
                  onChange={(e) => {
                    setMember({ ...member, memberDetailAddr: e.target.value });
                  }}
                ></Input>
              </li>
            </ul>
            <Button type="submit" className="btn primary lg">
              내 정보 수정
            </Button>
          </form>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default MemberInfo;
