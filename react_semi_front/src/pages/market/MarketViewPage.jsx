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
import MarketMap from "../../components/market/MarketMap";

/* 날짜아이콘 */
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
/* 조회수아이콘*/
import VisibilityIcon from "@mui/icons-material/Visibility";
/*유저아이콘 */
import PersonIcon from "@mui/icons-material/Person";
/*좋아요 아이콘 */
import FavoriteIcon from "@mui/icons-material/Favorite";

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
  /*금액 함수*/
  const formatPrice = (price) => {
    if (price === 0) {
      return "무료나눔";
    }
    return price.toLocaleString() + "원"; // toLocaleString하면 현재 본인의 국가에 해당하는 숫자 표기법을 적용 (예 : 1000000 -> 1,000,000)
  };

  /* 게시글 불러오기 */
  useEffect(() => {
    if (!isReady) return;
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setMarket(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 404) {
          console.log("존재하지 않는 게시물입니다");
          Swal.fire({
            title: "잘못된 요청입니다.",
            icon: "warning",
            confirmButtonText: "닫기",
            confirmButtonColor: "var(--primary)",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/market");
            }
          });
        }

        if (err.response.status === 400) {
          console.log("Integer 범위를 넘는 요청");
          Swal.fire({
            title: "Integer 범위를 넘는 요청",
            icon: "warning",
            confirmButtonText: "닫기",
            confirmButtonColor: "var(--primary)",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/market");
            }
          });
        }
      });
  }, [memberId, marketNo, isReady, tradeRequestList]);

  /* 거래요청 함수 */
  const requestTrade = () => {
    Swal.fire({
      title: "거래요청하기",
      html: `
            <textarea id="report-reason" class="swal2-textarea" 
              placeholder="거래요청 메시지를 남겨주세요. (최대 100자)" 
              maxlength="100" 
              style="width: 85%; height: 100px; resize: none; font-size: 14px; margin-top: 10px;"></textarea>
            <div id="report-counter" style="text-align: right; width: 85%; margin: 5px auto 0; font-size: 13px; color: var(--gray4);">
              0/100
            </div>
          `,
      showCancelButton: true,
      confirmButtonText: "네",
      cancelButtonText: "아니오",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--gray5)",

      allowOutsideClick: false, // 배경(바깥쪽) 클릭해도 안 닫힘
      allowEscapeKey: false, // Esc 눌러도 안 닫힘

      // sweetalert으로 실시간으로 현재 글자수를 띄우기위해 값을 계산해서 addEvent로 input에 넣어주기 위한 함수
      // didOpen : sweetalert에서 제공하는 함수 -> alert창이 뜨고 나서 실행하는 함수
      didOpen: () => {
        // 위의 sweetalert의 html 요소들 가져오기
        const textarea = document.getElementById("report-reason");
        const counter = document.getElementById("report-counter");

        // 가져온 값을 넣어줌
        textarea.addEventListener("input", (e) => {
          const currentLength = e.target.value.length;
          counter.innerText = `${currentLength}/100`;

          // 1000자가 꽉 차면 빨간색으로 변경
          if (currentLength >= 100) {
            counter.style.color = "var(--danger)";
          } else {
            counter.style.color = "var(--gray4)";
          }
        });
      },

      preConfirm: () => {
        // 확인 버튼 눌렀을 때 텍스트 박스 내용 긁어오기 외부 - 라이브러리여서 찾아보고 이렇게 사용
        const reason = document.getElementById("report-reason").value;

        // 신고 사유(신고의 텍스트 박스 내용)가 없다면 쓰라고 하기
        if (!reason.trim()) {
          Swal.showValidationMessage("신고 사유를 입력해주세요."); // 빈칸이면 못 넘어가게 막기

          // sweetalert 스타일 맞추기 위해
          const validationMsg = Swal.getValidationMessage();
          if (validationMsg) {
            validationMsg.style.backgroundColor = "transparent";
            validationMsg.style.color = "var(--danger)";
          }
        }
        return reason;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const requestData = {
          marketNo: marketNo,
          buyerId: memberId,
          message: result.value, // 아까 긁어온 내용
        };

        axios
          .post(
            `${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/request`,
            requestData,
          )
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              setMarket({ ...market, isRequest: 1 });
              Swal.fire({
                icon: "success",
                title: "거래요청완료",
                confirmButtonText: "닫기",
                confirmButtonColor: "var(--primary)",
              });
            }
          })
          .catch((err) => {
            console.log("거래요청 실패:", err);
          });
      }
    });
  };

  /* 거래 요청취소 함수 */
  const cancelTrade = () => {
    Swal.fire({
      title: "거래요청 취소 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "네",
      cancelButtonText: "아니오",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/request`,
          )
          .then((res) => {
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
            console.log(err);
          });
      }
    });
  };

  /* 게시글 수정 함수 */
  const modifyMarket = () => {
    navigate(`/market/modify/${marketNo}`);
  };
  /* 게시글 삭제 함수 */
  const deleteMarket = () => {
    Swal.fire({
      title: "삭제 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네",
      cancelButtonText: "아니오",
      confirmButtonColor: "var(--primary)",
      cancelButtonColor: "var(--danger)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}`)
          .then((res) => {
            console.log(res.data);
            const { fileCount, allDeleted, result } = res.data;

            Swal.fire({
              title: "게시물 삭제확인",
              html: `
              게시글 삭제: ${result === 1 ? "성공" : "실패"}<br/>
              삭제된 파일 수: ${fileCount}개<br/>
              파일 전체 삭제 여부: ${allDeleted ? "성공" : "일부실패"}
              `,
              icon: result === 1 ? "success" : "error",
              confirmButtonText: "닫기",
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
          html: `
    <ul class="trade_ul">
      ${res.data
        .map(
          (trade) => `
        <li class="trade_li">
          <p class="trade_buyerId">${trade.buyerId}</p>
          <p class="trade_message">${trade.message}</p>
          <button class="trade_btn" data-id="${trade.buyerId}">
            거래 확정
          </button>
        </li>
      `,
        )
        .join("")}
    </ul>
  `,
          didOpen: () => {
            document.querySelectorAll(".trade_btn").forEach((btn) => {
              btn.addEventListener("click", (e) => {
                const buyerId = e.target.dataset.id;
                MySwal.close();
                requestAccepted(buyerId);
              });
            });
          },
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
  /*신고하기 함수*/
  const pushReport = () => {
    Swal.fire({
      title: "신고하기",
      html: `
            <textarea id="report-reason" class="swal2-textarea" 
              placeholder="신고 사유를 입력해주세요 (최대 1000자)" 
              maxlength="1000" 
              style="width: 85%; height: 100px; resize: none; font-size: 14px; margin-top: 10px;"></textarea>
            <div id="report-counter" style="text-align: right; width: 85%; margin: 5px auto 0; font-size: 13px; color: var(--gray4);">
              0/1000
            </div>
          `,
      showCancelButton: true,
      confirmButtonText: "신고",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--danger)",
      cancelButtonColor: "var(--gray5)",

      allowOutsideClick: false, // 배경(바깥쪽) 클릭해도 안 닫힘
      allowEscapeKey: false, // Esc 눌러도 안 닫힘

      // sweetalert으로 실시간으로 현재 글자수를 띄우기위해 값을 계산해서 addEvent로 input에 넣어주기 위한 함수
      // didOpen : sweetalert에서 제공하는 함수 -> alert창이 뜨고 나서 실행하는 함수
      didOpen: () => {
        // 위의 sweetalert의 html 요소들 가져오기
        const textarea = document.getElementById("report-reason");
        const counter = document.getElementById("report-counter");

        // 가져온 값을 넣어줌
        textarea.addEventListener("input", (e) => {
          const currentLength = e.target.value.length;
          counter.innerText = `${currentLength}/1000`;

          // 1000자가 꽉 차면 빨간색으로 변경
          if (currentLength >= 1000) {
            counter.style.color = "var(--danger)";
          } else {
            counter.style.color = "var(--gray4)";
          }
        });
      },

      preConfirm: () => {
        // 확인 버튼 눌렀을 때 텍스트 박스 내용 긁어오기 외부 - 라이브러리여서 찾아보고 이렇게 사용
        const reason = document.getElementById("report-reason").value;

        // 신고 사유(신고의 텍스트 박스 내용)가 없다면 쓰라고 하기
        if (!reason.trim()) {
          Swal.showValidationMessage("신고 사유를 입력해주세요."); // 빈칸이면 못 넘어가게 막기

          // sweetalert 스타일 맞추기 위해
          const validationMsg = Swal.getValidationMessage();
          if (validationMsg) {
            validationMsg.style.backgroundColor = "transparent";
            validationMsg.style.color = "var(--danger)";
          }
        }
        return reason;
      },
    }).then((result) => {
      // 확인(신고) 눌렀으면 backend로 전송

      if (result.isConfirmed) {
        // 신고 data
        const reportData = {
          marketNo: marketNo,
          memberId: memberId,
          marketReportReason: result.value, // 아까 긁어온 내용
        };

        axios
          .post(
            `${import.meta.env.VITE_BACKSERVER}/markets/reports`,
            reportData,
          )
          .then((res) => {
            if (res.data === 1) {
              setMarket({ ...market, isReport: 1 });
              Swal.fire({
                icon: "success",
                title: "신고완료",
                confirmButtonText: "닫기",
                confirmButtonColor: "var(--primary)",
              });
            }
          })
          .catch((err) => {
            console.log("신고 실패:", err);
          });
      }
    });
  };

  /*신고취소 함수*/
  const cancelReport = () => {
    Swal.fire({
      title: "신고내역을 취소 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "네",
      cancelButtonText: "아니오",
      confirmButtonColor: "var(--danger)",
      cancelButtonColor: "var(--primary)",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/reports`,
          )
          .then((res) => {
            console.log(res.data);
            if (res.data === 1) {
              setMarket({ ...market, isReport: 0 });
              Swal.fire({
                icon: "success", //
                title: "신고가 취소되었습니다",
                confirmButtonText: "닫기",
                confirmButtonColor: "var(--primary)",
              });
            }
          })
          .catch((err) => {
            console.log("신고취소 실패");
            console.log(err);
          });
      }
    });
  };

  /*채팅하기 함수*/
  const startChat = () => {
    // 기존의 채팅방이 있으면 return 받고, 없으면 새롭게 생성된 roomId return
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/chat/room/private/create?otherMemberId=${market.marketWriter}&marketNo=${market.marketNo}`,
      )
      .then((res) => {
        const roomId = res.data;
        navigate(`/chatpage/${roomId}`);
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
                      borderRadius: "8px",
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
                  width: "900px",
                  height: "720px",
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
          {market.completed === 1 && (
            <div className={styles.sold_out}>
              <p>판매완료된 게시글입니다.</p>
              <Button
                className="btn primary"
                onClick={() => {
                  navigate("/market");
                }}
              >
                다른 상품 보러가기
              </Button>
            </div>
          )}
          {market.marketStatus === 2 && (
            <div className={styles.hidden_market}>
              <p>숨겨진 게시물 입니다.</p>
              <Button
                className="btn primary"
                onClick={() => {
                  navigate("/market");
                }}
              >
                다른 상품 보러가기
              </Button>
            </div>
          )}

          <div className={styles.title_info}>
            <p className={styles.title_info_title}>{market.marketTitle}</p>
            <div className={styles.title_info_wrap}>
              <p
                className={
                  market.sellPrice === 0
                    ? styles.title_info_price_free
                    : styles.title_info_price
                }
              >
                {formatPrice(market.sellPrice)}
              </p>
              <p className={styles.title_info_writer}>{market.marketWriter}</p>
            </div>

            <div className={styles.date_view_like}>
              <p className={styles.date_wrap}>
                <CalendarTodayIcon />
                {market.marketDate.slice(0, 10)}
              </p>
              <p className={styles.viewCount_wrap}>
                <VisibilityIcon />
                {market.viewCount}
              </p>
              <p className={styles.likeCount_wrap}>
                <FavoriteIcon />
                {market.likeCount}
              </p>
            </div>
          </div>

          {(!memberId || memberId !== market.marketWriter) && (
            <div className={styles.title_btn}>
              {memberId ? (
                <>
                  {market.completed === 0 && (
                    <>
                      {/*거래요청 버튼*/}
                      {market.isRequest === 0 && (
                        <Button className="btn primary" onClick={requestTrade}>
                          거래요청
                        </Button>
                      )}

                      {market.isRequest === 1 && (
                        <Button
                          className="btn primary"
                          onClick={cancelTrade}
                          style={{
                            backgroundColor: "var(--gray8)",
                            fontWeight: "900",
                            color: "var(--primary)",
                          }}
                        >
                          요청취소
                        </Button>
                      )}
                    </>
                  )}
                  {/*좋아요 버튼*/}
                  {market.isLike === 0 ? (
                    <Button
                      className="btn primary"
                      style={{
                        backgroundColor: "var(--pink1)",
                        color: "white",
                        border: "1px solid var(--pink1)",
                      }}
                      onClick={likeOn}
                    >
                      좋아요
                    </Button>
                  ) : (
                    <Button
                      className="btn primary"
                      style={{
                        backgroundColor: "white",
                        color: "var(--pink1)",
                        fontWeight: "900",
                        border: "1px solid var(--pink1)",
                      }}
                      onClick={likeOff}
                    >
                      좋아요 취소
                    </Button>
                  )}
                  {/*신고하기 버튼*/}
                  {market.isReport === 0 ? (
                    <Button
                      className="btn primary"
                      style={{
                        backgroundColor: "var(--danger)",
                        color: "white",
                        border: "1px solid var(--danger)",
                      }}
                      onClick={pushReport}
                    >
                      신고하기
                    </Button>
                  ) : (
                    <Button
                      className="btn primary"
                      style={{
                        backgroundColor: "white",
                        color: "var(--danger)",
                        fontWeight: "900",
                        border: "1px solid var(--danger)",
                      }}
                      onClick={cancelReport}
                    >
                      신고취소
                    </Button>
                  )}
                  {/*채팅하기 버튼*/}
                  <Button className="btn primary" onClick={startChat}>
                    채팅하기
                  </Button>
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

          <div
            className={styles.content_wrap}
            dangerouslySetInnerHTML={{ __html: market.marketContent }}
          ></div>
          <MarketMap market={market} />

          {memberId &&
            memberId === market.marketWriter &&
            market.completed === 0 && (
              <div className={styles.button_wrap}>
                <Button className="btn primary" onClick={modifyMarket}>
                  수정
                </Button>
                <Button className="btn primary danger" onClick={deleteMarket}>
                  삭제
                </Button>
                <Button
                  className="btn primary"
                  style={{ backgroundColor: "var(--pink1)", border: "none" }}
                  onClick={tradeComplete}
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

export default MarketViewPage;
