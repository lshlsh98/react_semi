import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../components/utils/useAuthStore";
import styles from "./MarketWritePage.module.css";
import TextEditor from "./TextEditor";

const MarketWritePage = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!memberId) {
      Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다.",
      }).then(() => {
        navigate("/member/login");
      });
    }
  }, []);
  return (
    <>
      <MarketWriteFrm />
    </>
  );
};

const MarketWriteFrm = () => {
  const { memberId } = useAuthStore();
  console.log(memberId);
  return (
    <>
      <p className={styles.box}>하이</p>
      <TextEditor></TextEditor>
    </>
  );
};

export default MarketWritePage;
