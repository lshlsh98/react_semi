import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../components/utils/useAuthStore";
import styles from "./MarketWritePage.module.css";
import TextEditor from "./TextEditor";
import axios from "axios";
import Button from "../../components/ui/Button";

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
  }, [memberId]);

  /* 여기서부터 시작 */

  const [market, setMarket] = useState({
    marketTitle: "",
    marketContent: "",
    marketWriter: memberId,
    sellPrice: "",
    sellAddr: "",
  });
  /* 파일 관리용 스테이트 */
  const [files, setFiles] = useState([]);
  const addFiles = (fileList) => {
    const newFiles = [...files, ...fileList];
    setFiles(newFiles);
  };

  /* 파일 삭제용 스테이트 */
  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  /* */
  const inputMarket = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMarket = { ...market, [name]: value };
    setMarket(newMarket);
  };
  /* 테스트 에디터용 함수 */
  const inputMarketContent = (data) => {
    setMarket({ ...market, marketContent: data });
  };

  const registMarket = () => {
    if (
      market.marketTitle === "" ||
      market.marketContent === "" ||
      market.sellPrice === "" ||
      market.sellAddr === ""
    ) {
      return;
    }
    console.log("작성하기 버튼클릭");
    const form = new FormData();
    form.append("marketTitle", market.marketTitle);
    form.append("marketContent", market.marketContent);
    form.append("marketPrice", market.sellPrice);
    form.append("marketAddr", market.sellAddr);
    form.append("marketWriter", market.marketWriter);
    files.forEach((file) => {
      form.append("files", file);
    });
    for (let pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    /* 마켓 등록 요청 */
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/markets`, form, {
        headers: {
          "Content-Type": "multpart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data > 0) {
          Swal.fire({
            title: "게시글 작성 완료",
            icon: "success",
          }).then(() => {
            navigate("/market");
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <section>
      {/* 제목 필드 */}
      <div>
        <lable htmlFor="marketTitle">제목</lable>
        <input
          type="text"
          name="marketTitle"
          id="marketTitle"
          value={market.marketTitle}
          onChange={inputMarket}
        ></input>
      </div>
      {/* 금액 필드 */}
      <div>
        <lable htmlFor="sellPrice">판매금액</lable>
        <input
          type="text"
          name="sellPrice"
          id="sellPrice"
          value={market.sellPrice}
          onChange={inputMarket}
        ></input>
      </div>
      {/* 내용 필드 */}
      <div>
        <lable htmlFor="marketContent">내용</lable>
        <MarketWriteFrm
          market={market}
          inputMarket={inputMarket}
          inputMarketContent={inputMarketContent}
          files={files}
          addFiles={addFiles}
          deleteFile={deleteFile}
        />
      </div>
      {/* 거래장소 필드 */}
      <div>
        <lable htmlFor="marketTitle">거래장소</lable>
        <input
          type="text"
          name="sellAddr"
          id="sellAddr"
          value={market.sellAddr}
          onChange={inputMarket}
        ></input>
      </div>
      {/* MAP API 영역 */}
      <div>
        <p>API 등록예정</p>
      </div>

      <div>
        <Button className="btn primary" onClick={registMarket}>
          작성하기
        </Button>
      </div>
    </section>
  );
};

const MarketWriteFrm = ({ market, inputMarketContent }) => {
  const { memberId } = useAuthStore();
  console.log(memberId);
  return (
    <>
      <div className={styles.editor}>
        <TextEditor data={market.marketContent} setData={inputMarketContent} />
      </div>
    </>
  );
};

export default MarketWritePage;
