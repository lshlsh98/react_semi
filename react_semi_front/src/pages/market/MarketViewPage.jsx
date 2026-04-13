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
import MarketComment from "../../components/market/MarketComment";
import { Modal, Box, IconButton } from "@mui/material"; // IconButton 추가
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";

const MarketViewPage = () => {
  const navigate = useNavigate();
  const { memberId, isReady } = useAuthStore();
  const params = useParams();
  const marketNo = params.marketNo;

  const [market, setMarket] = useState(null);
  const imgUrl = "http://192.168.31.24:9999/market";

  /* 모달용 스테이트 */
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = market?.fileList || [];

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  /* F5키 ctrl+r 제한 */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
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
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "요청",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("거래요청 로직 실행");
      }
    });
  };
  const deleteMarket = () => {
    Swal.fire({
      title: "삭제 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--danger)",
      cancelButtonColor: "var(--primary)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}`)
          .then((res) => {
            console.log(res.data);
            const { fileCount, allDeleted, result } = res.data;

            Swal.fire({
              title: "삭제확인",
              html: `
              게시글 삭제: ${result === 1 ? "성공" : "실패"}<br/>
              삭제된 파일 수: ${fileCount}개<br/>
              파일 전체 삭제 여부: ${allDeleted ? "성공" : "일부실패"}
              `,
              icon: result === 1 ? "success" : "error",
              confirmButtonText: "확인",
              confirmButtonColor: "pink",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/market");
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const deleteMarket = () => {
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
          .delete(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}`)
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              Swal.fire("삭제 성공", "게시글이 삭제되었습니다.", "success");
              navigate("/market");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

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
                    alt="상품 이미지"
                    loading="lazy"
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "1px solid var(--primary)",
                    }}
                    onClick={() => handleOpen(index)}
                  />
                </ImageListItem>
              ))}
            </ImageList>

            {/* 이미지 상세 모달 */}
            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "var(--light)",
                  boxShadow: 24,
                  outline: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "90vw",
                  height: "80vh",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <IconButton
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "var(--danger)",
                    zIndex: 10,
                  }}
                >
                  <Close />
                </IconButton>

                <IconButton
                  onClick={prevImage}
                  sx={{
                    position: "absolute",
                    left: 20,
                    color: "var(--light)",
                    bgcolor: "var(--secendary)",
                    "&:hover": { bgcolor: "var(--primary)" },
                  }}
                >
                  <ChevronLeft fontSize="large" />
                </IconButton>

                <img
                  src={`${imgUrl}/${images[currentIndex]?.marketFilePath}`}
                  alt="상세보기"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />

                <IconButton
                  onClick={nextImage}
                  sx={{
                    position: "absolute",
                    right: 20,
                    color: "var(--light)",
                    bgcolor: "var(--secendary)",
                    "&:hover": { bgcolor: "var(--primary)" },
                  }}
                >
                  <ChevronRight fontSize="large" />
                </IconButton>

                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    color: "var(--primary)",
                    fontWeight: "bold",
                  }}
                >
                  {currentIndex + 1} / {images.length}
                </div>
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
                <p>좋아요 : {market.likeCount}</p>
              </div>
              <LikeAndReport marketNo={marketNo} />
            </div>
            <div className={styles.title_map}>지도가 들어갈 예정</div>

            {(!memberId || memberId !== market.marketWriter) && (
              <div className={styles.title_btn}>
                {memberId ? (
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
                ) : (
                  <Button
                    className="btn primary"
                    onClick={() => navigate("/member/login")}
                  >
                    거래요청
                  </Button>
                )}
              </div>
            )}
          </div>

          <div
            className={styles.content_wrap}
            dangerouslySetInnerHTML={{ __html: market.marketContent }}
          ></div>

          {memberId && memberId === market.marketWriter && (
            <div className={styles.button_wrap}>
              <Button className="btn primary">수정</Button>
              <Button className="btn primary danger" onClick={deleteMarket}>
                삭제
              </Button>
              <Button
                className="btn primary"
                style={{ backgroundColor: "pink", border: "none" }}
              >
                거래완료
              </Button>
            </div>
          )}
          <MarketComment
            marketNo={marketNo}
            memberId={memberId}
            marketWriter={market.marketWriter}
          />
        </>
      )}
    </main>
  );
};

const LikeAndReport = ({ marketNo }) => {
  const { memberId } = useAuthStore();
  const [likeInfo, setLikeInfo] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
      .then((res) => setLikeInfo(res.data))
      .catch((err) => console.log(err));
  }, [marketNo]);

  const likeOn = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
      .then((res) => {
        if (res.data === 1) {
          setLikeInfo((prev) => ({
            ...prev,
            isLike: 1,
            likeCount: prev.likeCount + 1,
          }));
        }
      })
      .catch((err) => console.log(err));
  };

  const likeOff = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
      .then((res) => {
        if (res.data === 1) {
          setLikeInfo((prev) => ({
            ...prev,
            isLike: 0,
            likeCount: prev.likeCount - 1,
          }));
        }
      })
      .catch((err) => console.log(err));
  };

  const loginMsg = () =>
    Swal.fire("알림", "로그인 후 이용 가능합니다.", "info");

  return (
    <>
      {likeInfo && (
        <>
          {likeInfo.isLike === 1 ? (
            <ThumbUpAltIcon
              sx={{ fill: "var(--primary)", cursor: "pointer" }}
              onClick={likeOff}
            />
          ) : (
            <ThumbUpOffAltIcon
              sx={{ fill: "var(--primary)", cursor: "pointer" }}
              onClick={memberId ? likeOn : loginMsg}
            />
          )}
          <span style={{ color: "var(--primary)", marginRight: "10px" }}>
            {likeInfo.likeCount}
          </span>
        </>
      )}
      <ReportGmailerrorredIcon
        sx={{ fill: "var(--danger)", cursor: "pointer" }}
      />
      <span style={{ color: "var(--danger)" }}>3</span>
    </>
  );
};

export default MarketViewPage;
