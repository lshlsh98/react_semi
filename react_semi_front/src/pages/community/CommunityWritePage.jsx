import { Input } from "../../components/ui/Form";
import styles from "./Community.module.css";

const CommunityWritePage = () => {
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
      </div>
    </section>
  );
};

export default CommunityWritePage;
