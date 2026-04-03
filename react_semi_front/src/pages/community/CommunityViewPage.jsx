import { useNavigate, useParams } from "react-router-dom";
import styles from "./Community.module.css";
import { useEffect, useState } from "react";
import useAuthStore from "../../components/utils/useAuthStore";
import axios from "axios";
import Swal from "sweetalert2";

const CommunityViewPage = () => {
  const params = useParams();
  const communityNo = params.communityNo;
  const [community, setCommunity] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env_VITE_BACKSERVER}/communties/${communityNo}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className={styles.community_wrap}>
      <h3 className="page-title">게시글 상세보기</h3>
      {community && (
        <>
          <div className={styles.community_view_wrap}>
            <div className={styles.community_view_header}>
              <h2 className={styles.community_title}>
                {community.communityTitle}
              </h2>
              <div className={styles.community_sub_info}>
                <span>{community.communityWriter}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CommunityViewPage;
