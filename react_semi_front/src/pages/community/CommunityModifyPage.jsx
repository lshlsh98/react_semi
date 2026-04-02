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
  const [community, setCommunity] = useState({
    communityTitle: "",
    communityContent: "",
    communityWriter: "",
  });

  const loginUser = JSON.parse(localStorage.getItem("user"));
  const isWriter =
    community.communityWriter &&
    loginUser?.username === community.communityWriter;

  useEffect(() => {
    if (communityNo) {
      axios
        .get(`${import.meta.env.VITE_BACKSERVER}/community/${communityNo}`)
        .then((res) => {
          console.log(res.data);
          setCommunity(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [communityNo]);

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
    form.append("communityWriter", community.communityWriter);

    axios
      .put(`${import.meta.env.VITE_BACKSERVER}/community/${communityNo}`, form)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "수정 성공!",
          confirmButtonText: "확인",
        });
        navigate(`/community/detail/${communityNo}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteCommunity = () => {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/community/${communityNo}`)
          .then(() => {
            Swal.fire("삭제가 완료 되었습니다.", "", "success");
            navigate("/community/list");
          })
          .catch((err) => console.log(err));
      }
    });
  };

  return (
    <section className={styles.community_wrap}>
      <h3 className="page-title">
        {isWriter ? "게시글 수정" : "게시글 상세보기"}
      </h3>
      {community && (
        <CommunityFrm
          community={community}
          inputCommunity={inputCommunity}
          inputCommunityContent={inputCommunityContent}
          isWriter={isWriter}
        />
      )}
      <div className={styles.btn_wrap}>
        {isWriter ? (
          <>
            <Button className="btn primary" onClick={modifyCommunity}>
              수정
            </Button>
            <Button className="btn danger" onClick={deleteCommunity}>
              취소
            </Button>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default CommunityModifyPage;
