import { useState } from "react";
import styles from "./Community.module.css";
import CommunityFrm from "../../components/community/CommunityFrm";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import TextEditor from "../../components/ui/TextEditor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../components/utils/useAuthStore";

const CommunityWritePage = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const [community, setCommunity] = useState({
    communityTitle: "",
    communityContent: "",
    communityWriter: memberId,
  });

  const [member, setMember] = useState(3); // 1: 슈퍼 유저, 2: 관리자, 3: 일반

  const inputCommunity = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newCommunity = { ...community, [name]: value };
    setCommunity(newCommunity);
  };
  const inputCommunityContent = (data) => {
    setCommunity({ ...community, communityContent: data });
  };

  const registCommunity = () => {
    if (
      community.communityTitle.trim() === "" ||
      community.communityContent.trim() === ""
    ) {
      Swal.fire("제목과 내용을 입력해주세요.", "", "warning");
      return;
    }
    const form = new FormData();
    form.append("communityTitle", community.communityTitle);
    form.append("communityContent", community.communityContent);
    form.append("communityWriter", community.communityWriter);

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/communities`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data > 0) {
          Swal.fire({ title: "게시글 작성 완료", icon: "success" }).then(() => {
            if (member === 1 || member === 2) {
              navigate("/community/notice");
            } else {
              navigate("/community");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={styles.community_wrap}>
      <h3 className="page-title">게시글 작성</h3>
      <CommunityFrm
        community={community}
        inputCommunity={inputCommunity}
        inputCommunityContent={inputCommunityContent}
      />
      <div className={styles.btn_wrap}>
        <Button className="btn primary" onClick={registCommunity}>
          등록
        </Button>
        <Button className="btn light" onClick={() => navigate("/community")}>
          취소
        </Button>
      </div>
    </section>
  );
};

export default CommunityWritePage;
