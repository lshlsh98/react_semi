import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import styles from "./Community.module.css";
import { useState } from "react";
import TextEditor from "../../components/ui/TextEditor";

const CommunityWritePage = () => {
  const navigate = useNavigate();

  const [community, setCommunity] = useState({
    communityTitle: "",
    communityContent: "",
  });

  const [member, setMember] = useState(3); // 1: 슈퍼 유저, 2: 관리자, 3: 일반

  return (
    <section className={styles.community_wrap}>
      <div className={styles.communitywrite_card}>
        <label htmlFor="communityTitle" />
        <Input
          type="text"
          name="communityTitle"
          id="communityTitle"
          placeholder="제목"
        ></Input>

        <label htmlFor="communityContent" />
        <TextEditor className={styles.editor} />
        <textarea
          className={styles.content}
          type="text"
          name="communityContent"
          id="communityContent"
          placeholder="내용"
        />
      </div>

      <form className={styles.btn_wrap}>
        <Button
          className="btn primary"
          onClick={() => {
            if (member === 1 || member === 2) {
              // 1: 슈퍼 유저, 2: 관리자
              navigate("/community/notice"); // 커뮤니티 공지사항
            } else {
              navigate("/community/list"); // 커뮤니티 게시판
            }
          }}
        >
          등록
        </Button>
        <Button
          className="btn light outline"
          onClick={() => navigate("/community/list")}
        >
          취소
        </Button>
      </form>
    </section>
  );
};

export default CommunityWritePage;
