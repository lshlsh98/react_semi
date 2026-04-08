import styles from "./MarketViewPage.module.css";
import Button from "../../components/ui/Button";
import useAuthStore from "../../components/utils/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ReportIcon from "@mui/icons-material/Report";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import Swal from "sweetalert2";
import { Modal, Box } from "@mui/material";

const MarketViewPage = () => {
  const navigate = useNavigate();
  const { memberId, isReady } = useAuthStore();
  //console.log(memberId);

  const params = useParams();
  const marketNo = params.marketNo;
  //console.log("게시글번호 : " + marketNo);

  const [market, setMarket] = useState(null);
  const imgUrl = "http://192.168.31.24:9999/market";

  /* 모달용 스테이트 */
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const handleOpen = (filePath) => {
    setSelectedImg(filePath);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    outline: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "90vw",
    maxHeight: "90vh",
  };

  console.log("isReady 확인용 : ", isReady);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}`)
      .then((res) => {
        console.log(res.data);
        setMarket(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [memberId, marketNo, isReady]);

  const requestTrade = () => {
    Swal.fire({
      title: "거래요청 하시겠습니까?",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "요청",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then(() => {
      console.log("거래요청 해봅시다.");
    });
  };
  const likeOn = () => {};
  return (
    <main className={styles.main_wrap}>
      {market && (
        <>
          <div className={styles.photo_wrap}>
            <ImageList
              sx={{ width: 900, height: 360 }}
              cols={3}
              rowHeight={164}
            >
              {market.fileList.map((file, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`${imgUrl}/${file.marketFilePath}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${imgUrl}/${file.marketFilePath}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt="상품 이미지"
                    loading="lazy"
                    title="클릭시 큰이미지로 볼 수 있어요"
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid var(--primary)",
                    }}
                    onClick={() =>
                      handleOpen(`${imgUrl}/${file.marketFilePath}`)
                    } // 클릭 시 모달 열기
                  />
                </ImageListItem>
              ))}
            </ImageList>
            <Modal open={open} onClose={handleClose}>
              <Box sx={modalStyle}>
                <img
                  src={selectedImg}
                  alt="상세이미지"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                  }}
                />
                <button
                  onClick={handleClose}
                  style={{
                    marginTop: "20px",
                    padding: "8px 20px",
                    backgroundColor: "#549849",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  닫기
                </button>
              </Box>
            </Modal>
          </div>

          <div className={styles.title_wrap}>
            <div className={styles.title_info}>
              <p className={styles.title_info_title}>{market.marketTitle}</p>
              <p className={styles.title_info_price}>
                {market.sellPrice.toLocaleString("ko-KR")}원
              </p>
              <div className={styles.date_view_like}>
                <p>{market.marketDate.slice(0, 10)}</p>
                <p>조회수 : {market.viewCount}</p>
                <p>좋아요 : </p>
              </div>
              <LikeAndReport marketNo={marketNo} />
            </div>
            <div className={styles.title_map}>지도가 들어갈 예정</div>
            <div className={styles.title_btn}>
              {memberId ? (
                memberId !== market.marketWriter && (
                  <>
                    <Button className="btn primary" onClick={requestTrade}>
                      거래요청
                    </Button>
                    <Button
                      className="btn primary"
                      style={{
                        backgroundColor: "pink",
                        border: "1px solid pink",
                      }}
                    >
                      좋아요
                    </Button>
                    <Button className="btn primary danger">신고하기</Button>
                  </>
                )
              ) : (
                <Button
                  className="btn primary"
                  onClick={() => navigate("/member/login")}
                >
                  로그인하기
                </Button>
              )}
            </div>
          </div>

          <div
            className={styles.content_wrap}
            dangerouslySetInnerHTML={{ __html: market.marketContent }}
          ></div>
          {memberId && memberId === market.marketWriter && (
            <div className={styles.button_wrap}>
              <Button className="btn primary">수정</Button>
              <Button className="btn primary danger">삭제</Button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

const LikeAndReport = ({ marketNo }) => {
  const { memberId } = useAuthStore();
  const [likeInfo, setLikeInfo] = useState(null);
  console.log("글번호 확인용 : ", marketNo);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
      .then((res) => {
        console.log(res);
        setLikeInfo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likeOn = () => {
    alert("좋아요 승인합니다");
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          setLikeInfo.isLike(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const likeOff = () => {
    alert("좋아요 해제합니다");
    axios
      .delete(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loginMsg = () => {
    alert("로그인하세요");
  };
  return (
    <>
      {likeInfo && (
        <>
          {likeInfo.isLike === 1 ? (
            <ThumbUpAltIcon
              sx={{ fill: "var(--primary)" }}
              style={{ cursor: "pointer" }}
              onClick={likeOff}
            />
          ) : (
            <ThumbUpOffAltIcon
              sx={{ fill: "var(--primary)" }}
              style={{ cursor: "pointer" }}
              onClick={
                memberId ? likeOn : loginMsg
              } /* 로그인되어있으면 likeOn 안되어있으면 loginMsg */
            />
          )}

          <span style={{ color: "var(--primary)" }}>{likeInfo.likeCount}</span>
        </>
      )}

      <ReportGmailerrorredIcon
        sx={{ fill: "var(--danger)" }}
        style={{ cursor: "pointer" }}
      />
      <ReportIcon
        sx={{ fill: "var(--danger)" }}
        style={{ cursor: "pointer" }}
      />
      <span style={{ color: "var(--danger)" }}>3</span>
    </>
  );
};

export default MarketViewPage;
