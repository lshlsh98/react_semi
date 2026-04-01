import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../components/utils/useAuthStore";
import styles from "./MarketWritePage.module.css";
import TextEditor from "./TextEditor";
import axios from "axios";
import Button from "../../components/ui/Button";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ClearIcon from "@mui/icons-material/Clear";
import { useKakaoPostcode } from "@clroot/react-kakao-postcode";
import { Input } from "../../components/ui/form";
import { useRef } from "react";

const MarketWritePage = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const saveDraft = () => {
    localStorage.setItem("tempMarket", JSON.stringify(market));
    Swal.fire({
      icon: "success",
      title: "임시저장 완료!",
    });
  };
  useEffect(() => {
    if (!memberId) {
      Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다.",
      }).then(() => {
        navigate("/member/login");
      });
    }
    const saved = localStorage.getItem("tempMarket");
    if (saved) {
      setMarket(JSON.parse(saved));
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
    /* 이미지 파일이 아니면 제외함 */

    const imageFiles = fileList.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length !== fileList.length) {
      Swal.fire({
        icon: "warning",
        title: "이미지 파일만 업로드 가능합니다.",
      });
    }
    if (files.length + imageFiles.length > 3) {
      Swal.fire({
        icon: "warning",
        title: "이미지는 최대 3장까지 업로드 가능합니다.",
      });
      return;
    }

    const newFiles = [...files, ...imageFiles];
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

  const inputMarketPrice = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const num = Number(value);
    if (num < 0) {
      Swal.fire({
        icon: "warning",
        title: "0원 보다 작게 설정하실수는 없어요!",
      });
      setMarket({ ...market, [name]: "" });
      return;
    }
    setMarket({ ...market, [name]: value });
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
      market.sellAddr === "" ||
      files.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "빠짐없이 작성해주세요.",
      });
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
    /* 폼데이터 콘솔 */
    for (let pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    /* 마켓 등록 요청 */
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/markets`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
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

  /* 판매주소*/
  const detailRef = useRef(null);

  const { open } = useKakaoPostcode({
    onComplete: (data) => {
      //console.log(data);

      setMarket({
        ...market,
        marketPostcode: data.zonecode,
        sellAddr: data.roadAddress,
      });
      detailRef.current.focus();
    },
  });
  return (
    <section className={styles.market_write_wrap}>
      {/* 제목 필드 */}
      <div className={styles.market_input_wrap_title}>
        <label htmlFor="marketTitle">제목</label>
        <input
          type="text"
          name="marketTitle"
          id="marketTitle"
          value={market.marketTitle}
          onChange={inputMarket}
        ></input>
      </div>
      {/* 금액 필드 */}
      <div className={styles.market_input_wrap_price}>
        <label htmlFor="sellPrice">판매금액(원)</label>
        <input
          type="number"
          name="sellPrice"
          id="sellPrice"
          value={market.sellPrice}
          onChange={inputMarketPrice}
          placeholder="숫자만입력가능"
        ></input>
      </div>
      {/* 내용 필드 */}
      <div className={styles.market_input_wrap_content}>
        <MarketWriteFrm
          market={market}
          inputMarket={inputMarket}
          inputMarketContent={inputMarketContent}
          files={files}
          addFiles={addFiles}
          deleteFile={deleteFile}
        />
      </div>
      {/* 파일첨부 필드 */}

      <div className={styles.input_wrap}>
        <label htmlFor="files">첨부파일</label>
        <label htmlFor="files" className={styles.file_btn}>
          파일추가
        </label>
        <input
          type="file"
          id="files"
          multiple
          accept="image/*" /* 1차로 업로드파일 이미지로 제한 */
          style={{ display: "none" }}
          onChange={(e) => {
            //e.target.files -> 선택한 파일들을 FileList 객체로 반환 (배열로 유사하지만 배열은 아님)
            //배열로 변환해서 사용
            const fileList = Array.from(e.target.files);
            //console.log(fileList);

            addFiles(fileList);
          }}
        ></input>
        <div className={styles.file_wrap}>
          {market.fileList &&
            market.fileList.map((file, index) => {
              return (
                <FileItem
                  key={"old-file-item-" + index}
                  file={file}
                  deleteFile={addDeleteFileList}
                ></FileItem>
              );
            })}
          {files.map((file, index) => {
            return (
              <FileItem
                key={"file-item-" + index}
                file={file}
                deleteFile={deleteFile}
              ></FileItem>
            );
          })}
        </div>
      </div>

      {/* 거래장소 필드 */}
      <div className={styles.market_input_wrap_addr}>
        <label htmlFor="marketTitle">거래장소</label>
        {/* <input
          type="text"
          name="sellAddr"
          id="sellAddr"
          value={market.sellAddr}
          onChange={inputMarket}
        ></input> */}

        <Button type="button" className="btn primary" onClick={open}>
          주소 찾기
        </Button>
        <Input
          type="text"
          name="sellAddr"
          id="sellAddr"
          value={market.sellAddr}
          onChange={inputMarket}
          readOnly={true}
        ></Input>
        <Input
          style={{ display: "none" }}
          type="text"
          name="sellAddrDetail"
          //value={market.sellAddrDetail}
          onChange={inputMarket}
          placeholder="상세주소 입력"
          ref={detailRef}
        />
      </div>
      {/* MAP API 영역 */}
      <div className={styles.market_input_wrap}>
        <p>API 등록예정</p>
      </div>

      <div className={styles.market_input_wrap}>
        <Button className="btn primary" onClick={registMarket}>
          작성하기
        </Button>
        <Button className="btn primary" onClick={saveDraft}>
          임시저장
        </Button>
        <Button
          className="btn primary"
          onClick={() => {
            navigate("/market");
          }}
        >
          작성취소
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

const FileItem = ({ file, deleteFile }) => {
  return (
    <ul className={styles.file_item}>
      <li>
        <InsertPhotoIcon />
      </li>
      {/*file.name || file.marketFileName 수정할때 파일이름 출력*/}
      <li className={styles.file_name}>{file.name || file.marketFileName}</li>
      <li>
        <ClearIcon
          className={styles.file_delete}
          onClick={() => {
            deleteFile(file);
          }}
        />
      </li>
    </ul>
  );
};

export default MarketWritePage;
