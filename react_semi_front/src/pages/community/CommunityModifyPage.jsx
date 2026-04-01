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
    fileList: [],
  });

  const [files, setFiles] = useState([]); // 새로 추가할 첨부파일
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

  useEffect(() => {
    if (communityNo) {
      axios
        .put(`${import.meta.env.VITE_BACKSERVER}/community/${communityNo}`)
        .then((res) => {
          console.log(res.data);
          setCommunity(res.data);
          Swal.fire({
            icon: "success",
            title: "수정 완료!",
          });
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
  const [deleteFileList, setDeleteFileList] = useState([]);
  const addDeleteFileList = (file) => {
    const newFileList = community.fileList.filter((item) => {
      return item !== file;
    });
    setCommunity({ ...community, fileList: newFileList });
    setDeleteFileList([...deleteFileList, file.communityFilePath]);
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
      <h3 className="page-title">게시글 수정</h3>
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
          onClick={() => navigate(`/community/detail/${communityNo}`)}
        >
          취소
        </Button>
      </div>
    </section>
  );
};

export default CommunityModifyPage;
