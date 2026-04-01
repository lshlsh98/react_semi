import { useNavigate, useParams } from "react-router-dom";
import styles from "./Community.module.css";
import { useEffect, useState } from "react";
import CommunityFrm from "../../components/community/CommunityFrm";
import Button from "../../components/ui/Button";
import axios from "axios";
const CommunityModifyPage = () => {
  const navigate = useNavigate();

  const params = useParams();

  const communityNo = params.communityNo;

  const [community, setCommunity] = useState(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/community/${communityNo}`)
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
    files.forEach((file) => {
      form.append("files", file);
    });
  };

  return (
    <section className={styles.community_wrap}>
      {community && (
        <CommunityFrm
          community={community}
          inputCommunity={inputCommunity}
          files={files}
          addFiles={addFiles}
          deleteFile={deleteFile}
          inputCommunityContent={inputCommunityContent}
          addDeleteFileList={addDeleteFileList}
        />
      )}
      <div className={styles.btn_wrap}>
        <Button className="btn primary" onClick={modifyCommunity}>
          수정
        </Button>

        <Button
          className="btn light outline"
          onClick={() => navigate("/community/detail")}
        >
          취소
        </Button>
      </div>
    </section>
  );
};

export default CommunityModifyPage;
