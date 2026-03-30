import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import styles from "./Community.module.css";

const CommunityWritePage = () => {
  const navigate = useNavigate();

  const registCommunity = () => {
    if (community.communityTitle === "" || community.communityContent === "") {
      return;
    }
  };

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
        <Input
          type="text"
          name="communityContent"
          id="communityContent"
          placeholder="내용"
        ></Input>
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
