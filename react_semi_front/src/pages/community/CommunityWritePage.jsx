import { useState } from "react";
import styles from "./Community.module.css";
import CommunityFrm from "../../components/community/CommunityFrm";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import TextEditor from "../../components/ui/TextEditor";
import axios from "axios";

const CommunityWritePage = () => {
  const navigate = useNavigate();

  const [community, setCommunity] = useState({
    communityTitle: "",
    communityContent: "",
  });

  const [member, setMember] = useState(3); // 1: 슈퍼 유저, 2: 관리자, 3: 일반

  const [files, setFiles] = useState([]);
  const addFiles = (fileList) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);
  };
  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  const inputCommunity = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newCommunity = { ...community, [name]: value };
    setCommunity(newCommunity);
  };
  const inputCommunityContent = (data) => {
    setBoard({ ...community, communityContent: data });
  };

  const registCommunity = () => {
    if (community.communityTitle === "" || community.communityContent === "") {
      return;
    }
    const form = new FormData();
    form.append("communityTitle", community.communityTitle);
    form.append("communityContent", community.communityContent);
    files.forEach((file) => {
      form.append("files", file);
    });

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/community`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data > 0) {
          Swal.fire({ title: "게시글 작성 완료", icon: "success" }).then(() => {
            if (member === 1 || member === 2) {
              navigate("/community/notice");
            } else {
              navigate("/community/list");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={styles.community_wrap}>
      <h3 className="page-title">게시글 작성</h3>
      <CommunityFrm
        community={community}
        inputCommunity={inputCommunity}
        files={files}
        addFiles={addFiles}
        deleteFile={deleteFile}
        inputCommunityContent={inputCommunityContent}
      />

      <div className={styles.btn_wrap}>
        <Button className="btn primary" onClick={registCommunity}>
          등록
        </Button>
        <Button
          className="btn light"
          onClick={() => navigate("/community/list")}
        >
          취소
        </Button>
      </div>
    </section>
  );
};

export default CommunityWritePage;
