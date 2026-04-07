import { useNavigate, useParams } from "react-router-dom";
import styles from "./Community.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CommunityFrm from "../../components/community/CommunityFrm";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";

const CommunityModifyPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const communityNo = params.communityNo;
  const [community, setCommunity] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}`)
      .then((res) => {
        console.log(res.data);
        setCommunity(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const inputCommunity = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newCommunity = { ...community, [name]: value };
    setCommunity(newCommunity);
  };

  const inputCommunityContent = (data) => {
    setCommunity({ ...community, communityContent: data });
  };

  const modifyCommunity = () => {
    const form = new FormData();
    form.append("communityTitle", community.communityTitle);
    form.append("communityContent", community.communityContent);

    axios
      .put(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}`,
        form,
      )
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "게시물 수정 성공!",
          confirmButtonText: "확인",
        });
        navigate(`/community/view/${communityNo}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={styles.community_wrap}>
      <h3 className="page-title">게시글 수정</h3>

      {community && (
        <CommunityFrm
          community={community}
          inputCommunity={inputCommunity}
          inputCommunityContent={inputCommunityContent}
        />
      )}

      <div className={styles.btn_wrap}>
        <Button className="btn primary" onClick={modifyCommunity}>
          수정
        </Button>
        <Button
          className="btn light outline"
          onClick={() => navigate(`/community/view/${communityNo}`)}
        >
          취소
        </Button>
      </div>
    </section>
  );
};

export default CommunityModifyPage;
