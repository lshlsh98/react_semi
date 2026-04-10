import styles from "./MarketViewPage.module.css";
import Button from "../../components/ui/Button";
import useAuthStore from "../../components/utils/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import MarketComment from "../../components/market/MarketComment";
import { Modal, Box, IconButton } from "@mui/material"; // IconButton 추가
import { ChevronLeft, ChevronRight, Close } from "@mui/icons-material";

const MarketViewPage = () => {
  const navigate = useNavigate();
  const { memberId, isReady } = useAuthStore();
  const params = useParams();
  const marketNo = params.marketNo;
  const MySwal = withReactContent(Swal);

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

  /* 거래요청 리스트용 스테이트 */
  const [tradeRequestList, setTradeRequestList] = useState([]);
  /* F5키 ctrl+r 제한 */
  /*
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
  */

  /* 게시글 불러오기 */
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
  }, [memberId, marketNo, isReady, tradeRequestList]);

  /* 거래요청 함수 */
  const requestTrade = () => {
    Swal.fire({
      title: "거래요청 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "요청",
      cancelButtonText: "닫기",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/request`,
          )
          .then((res) => {
            console.log(res.data);
            if (res.data === 1) {
              setMarket({ ...market, isRequest: 1 });
              Swal.fire({
                icon: "success", // 성공 아이콘 (체크 표시)
                title: "거래요청완료",
                confirmButtonText: "닫기",
                confirmButtonColor: "var(--primary)",
              });
            }
          })
          .catch((err) => {
            console.log("거래요청 실패");
            console.log(err.data);
          });
      }
    });
  };

  /* 거래 요청취소 함수 */
  const cancelTrade = () => {
    console.log("거래취소요청");
    Swal.fire({
      title: "거래요청 취소 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "취소",
      cancelButtonText: "닫기",
      confirmButtonColor: "var(--danger)",
      cancelButtonColor: "var(--primary)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/cancel`,
          )
          .then((res) => {
            console.log(res.data);
            if (res.data === 1) {
              setMarket({ ...market, isRequest: 0 });
              Swal.fire({
                icon: "success", // 성공 아이콘 (체크 표시)
                title: "취소완료",
                confirmButtonText: "닫기",
                confirmButtonColor: "var(--primary)",
              });
            }
          })
          .catch((err) => {
            console.log("거래요청취소 실패");
            console.log(err.data);
          });
      }
    });
  };

  /* 게시글삭제 함수 */
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

  /* 거래완료버튼 클릭시 요청리스트 띄우기 */
  const tradeComplete = () => {
    console.log("거래완료 로직 실행");
    console.log(market.marketNo);
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/complete`)
      .then((res) => {
        console.log("거래요청리스트 호출 성공");
        console.log(res);
        setTradeRequestList(res.data);
        if (res.data.length === 0) {
          MySwal.fire("알림", "대기 중인 거래 요청이 없습니다.", "info");
          return;
        }
        MySwal.fire({
          title: "거래 요청 목록",
          html: (
            <ul className={styles.trade_ul}>
              {/* setTradeRequestList 대신 받아온 res.data를 직접 맵핑 */}
              {res.data.map((trade) => (
                <li className={styles.trade_li} key={trade.tradeNo}>
                  <p className={styles.trade_buyerId}>{trade.buyerId}</p>
                  <p className={styles.trade_message}>{trade.message}</p>
                  <button
                    className={styles.trade_btn}
                    onClick={() => {
                      MySwal.close();
                      requestAccepted(trade.buyerId);
                    }}
                  >
                    거래 확정
                  </button>
                </li>
              ))}
            </ul>
          ),
          width: "900px",
          showConfirmButton: false,
          showCloseButton: true,
        });
      })

      .catch((err) => {
        console.log(err);
      });
  };
  /* 거래 확정 함수 */
  const requestAccepted = (buyerId) => {
    console.log(buyerId);
    Swal.fire({
      title: `${buyerId} 님과 거래완료 하시겠습니까?`,
      icon: "question",
      width: "720px",
      showCancelButton: true,
      confirmButtonText: "확정",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/complete/${buyerId}`,
          )
          .then((res) => {
            console.log(res.data);
            if (res.data > 1) {
              Swal.fire({
                icon: "success", // 성공 아이콘 (체크 표시)
                title: "거래가 완료되었습니다",
                confirmButtonText: "닫기",
                confirmButtonColor: "var(--primary)",
              });

              navigate("/market");
            }
          })
          .catch((err) => {
            console.log("거래확정실패");
            console.log(err);
          });
      }
    });
  };
  /* 좋아요 함수 */
  const likeOn = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
      .then((res) => {
        if (res.data === 1) {
          console.log("좋아요 완료");
          setMarket({ ...market, isLike: 1, likeCount: market.likeCount + 1 });
        }
      })
      .catch((err) => console.log(err));
  };
  /* 좋아요 취소 함수 */
  const likeOff = () => {
    axios
      .delete(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
      .then((res) => {
        if (res.data === 1) {
          console.log("좋아요 취소");
          setMarket({ ...market, isLike: 0, likeCount: market.likeCount - 1 });
        }
      })
      .catch((err) => console.log(err));
  };
  /* 로그인이 필요합니다 */
  const loginMsg = () => {
    Swal.fire("알림", "로그인 후 이용 가능합니다.", "info");
    navigate("/member/login");
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
                  width: "60vw",
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
            </div>
            <div className={styles.title_map}>지도가 들어갈 예정</div>

            {(!memberId || memberId !== market.marketWriter) && (
              <div className={styles.title_btn}>
                {memberId ? (
                  <>
                    {market.completed === 0 && (
                      <>
                        {market.isRequest === 0 && (
                          <Button
                            className="btn primary"
                            onClick={requestTrade}
                          >
                            거래요청
                          </Button>
                        )}

                        {market.isRequest === 1 && (
                          <Button
                            className="btn primary"
                            onClick={cancelTrade}
                            style={{
                              backgroundColor: "var(--soft)",
                              color: "black",
                            }}
                          >
                            요청취소
                          </Button>
                        )}
                      </>
                    )}

                    {market.isLike === 0 ? (
                      <Button
                        className="btn primary"
                        style={{
                          backgroundColor: "white",
                          color: "pink",
                          border: "1px solid pink",
                        }}
                        onClick={likeOn}
                      >
                        좋아요
                      </Button>
                    ) : (
                      <Button
                        className="btn primary"
                        style={{
                          backgroundColor: "pink",
                          color: "white",
                          border: "1px solid pink",
                        }}
                        onClick={likeOff}
                      >
                        좋아요 취소
                      </Button>
                    )}

                    <Button className="btn primary danger">신고하기</Button>
                  </>
                ) : (
                  <Button
                    className="btn primary"
                    onClick={loginMsg}
                    style={{ width: "200px" }}
                  >
                    거래요청(로그인필요)
                  </Button>
                )}
              </div>
            )}
          </div>

          <div
            className={styles.content_wrap}
            dangerouslySetInnerHTML={{ __html: market.marketContent }}
          ></div>

          {memberId &&
            memberId === market.marketWriter &&
            market.completed === 0 && (
              <div className={styles.button_wrap}>
                <Button className="btn primary">수정</Button>
                <Button className="btn primary danger" onClick={deleteMarket}>
                  삭제
                </Button>
                <Button
                  className="btn primary"
                  style={{ backgroundColor: "pink", border: "none" }}
                  onClick={tradeComplete}
                >
                  거래완료
                </Button>
              </div>
            )}
          <MarketComment marketNo={marketNo} memberId={memberId} />
        </>
      )}
    </main>
  );
};

export default MarketViewPage;
