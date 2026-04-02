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
    <section className={styles.community_wrap}>
      {community && (
        <>
          <div className={styles.community_view_wrap}>
            <div className={styles.community_view_header}>
              <h2 className={styles.community_title}>
                {community.communityTitle}
              </h2>
              <div className={styles.community_sub_info}>
                <div className={styles.community_writer}></div>
              </div>
            </div>
            <div className={styles.community_view_content}></div>
          </div>
        </>
      )}
    </section>
  );
};

export default CommunityViewPage;
