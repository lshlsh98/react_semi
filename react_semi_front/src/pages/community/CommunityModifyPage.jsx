import { useNavigate } from "react-router-dom";
import styles from "./Community.module.css";
import { useState } from "react";
import Button from "../../components/ui/Button";

const CommunityModifyPage = () => {
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  return (
    <section className={styles.community_wrap}>
      <Button
        className="btn light outline"
        onClick={() => navigate("/community/modify")}
      >
        취소
      </Button>
    </section>
  );
};

export default CommunityModifyPage;
