import { useNavigate, useParams } from "react-router-dom";
import styles from "./Community.module.css";
import { useEffect, useState } from "react";
import useAuthStore from "../../components/utils/useAuthStore";
import axios from "axios";
import Swal from "sweetalert2";

const CommunityViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const communityNo = params.communityNo;
  const { memberId, isReady } = useAuthStore();
  const [community, setCommunity] = useState(null);
  console.log(isReady, "isReady 확인");
  useEffect(() => {
    if (!isReady) {
      return;
    }
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/community/${communityNo}`)
      .then((res) => {
        console.log(res);
        setCommunity(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isReady]);

  const deleteCommunity = () => {
    Swal.fire({
      title: "게시글을 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/community/${communityNo}`)
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              navigate("/community/list");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  return (
    <ul className={styles.comment_item}>
      <li className={styles.comment_info}>
        <div className={styles.comment_writer_wrap}></div>
      </li>
    </ul>
  );
};

export default CommunityViewPage;
