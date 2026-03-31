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
        <TextEditor />
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
          onClick={() => navigate("/community/list")}
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
