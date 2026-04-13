import { useNavigate, useParams } from "react-router-dom";
import styles from "./CommunityViewPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../components/utils/useAuthStore";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";
import { TextArea } from "../../components/ui/Form";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Comment from "@mui/icons-material/Comment";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ReportIcon from "@mui/icons-material/Report";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

const CommunityViewPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const communityNo = params.communityNo;
  const { memberId, isReady } = useAuthStore();

  const [community, setCommunity] = useState(null);
  console.log(isReady, "isReady 확인");
  useEffect(() => {
    if (!isReady) {
      return;
    }
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}`)
      .then((res) => {
        setCommunity(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isReady]);

  const deleteCommunity = () => {
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
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}`,
          )
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              Swal.fire("삭제 성공", "게시글이 삭제되었습니다.", "success");
              navigate("/community");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <section className={styles.community_wrap}>
      {community && (
        <>
          <div className={styles.community_view_wrap}>
            <div className={styles.community_view_header}>
              <h2 className={styles.community_title}>
                {community.communityTitle}
              </h2>
              <div className={styles.community_sub_info}>
                <div className={styles.community_writer}>
                  <div
                    className={
                      community.memberThumb
                        ? styles.member_thumb_exists
                        : styles.member_thumb
                    }
                  >
                    <img
                      src={
                        community.memberThumb
                          ? `${import.meta.env.VITE_BACKSERVER}/member/thumb/${community.memberThumb}`
                          : null
                      }
                    ></img>
                  </div>
                  <span>{community.communityWriter}</span>
                </div>

                <div className={styles.community_date}>
                  <CalendarTodayIcon className={styles.icon} />
                  {community.communityDate}
                </div>

                <div className={styles.community_view_count}>
                  <VisibilityIcon className={styles.icon} />
                  <span>{community.viewCount}</span>
                </div>
              </div>
            </div>
            <div
              className={styles.community_view_content}
              dangerouslySetInnerHTML={{ __html: community.communityContent }}
            ></div>
          </div>

          <div className={styles.community_action_btn_wrap}>
            {memberId && memberId === community.communityWriter && (
              <div className={styles.button_group}>
                <Button
                  className="btn primary"
                  onClick={() => {
                    navigate(`/community/modify/${community.communityNo}`);
                  }}
                >
                  수정
                </Button>

                <Button
                  className="btn primary outline"
                  onClick={deleteCommunity}
                >
                  삭제
                </Button>
              </div>
            )}
            <LikeAndDislikeAndReport
              communityNo={communityNo}
              communityWriter={community.communityWriter}
            />
          </div>
          <CommunityCommentComponent communityNo={communityNo} />
        </>
      )}
    </section>
  );
};

const LikeAndDislikeAndReport = ({ communityNo, communityWriter }) => {
  const { memberId } = useAuthStore();
  const [likeInfo, setLikeInfo] = useState(null);
  const [dislikeInfo, setDislikeInfo] = useState(null);
  const [reportInfo, setReportInfo] = useState(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/likes`,
      )
      .then((res) => {
        setLikeInfo({
          isLike: res.data?.isLike ?? 0,
          likeCount: Number(res.data?.likeCount) || 0,
        });
      });
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/dislikes`,
      )
      .then((res) => {
        setDislikeInfo({
          isDislike: res.data?.isDislike ?? 0,
          dislikeCount: Number(res.data?.dislikeCount) || 0,
        });
      });
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/reports`,
      )
      .then((res) => {
        setReportInfo({
          isReport: res.data?.isReport ?? 0,
          reportCount: Number(res.data?.reportCount) || 0,
        });
      });
  }, []);

  const likeOn = () => {
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/likes`,
      )
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          setLikeInfo({
            ...likeInfo,
            isLike: 1,
            likeCount: likeInfo.likeCount + 1,
          });

          if (dislikeInfo?.isDislike === 1) {
            setDislikeInfo({
              isDislike: 0,
              dislikeCount: dislikeInfo.dislikeCount - 1,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const likeOff = () => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/likes`,
      )
      .then((res) => {
        if (res.data === 1) {
          setLikeInfo({
            ...likeInfo,
            isLike: 0,
            likeCount: likeInfo.likeCount - 1,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dislikeOn = () => {
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/dislikes`,
      )
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          setDislikeInfo({
            ...dislikeInfo,
            isDislike: 1,
            dislikeCount: dislikeInfo.dislikeCount + 1,
          });

          if (likeInfo?.isLike === 1) {
            setLikeInfo({
              isLike: 0,
              likeCount: likeInfo.likeCount - 1,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dislikeOff = () => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/dislikes`,
      )
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          setDislikeInfo({
            ...dislikeInfo,
            isDislike: 0,
            dislikeCount: dislikeInfo.dislikeCount - 1,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /*
  const reportOn = () => {
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/reports`,
      )
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          setReportInfo({
            ...reportInfo,
            isReport: 1,
            reportCount: reportInfo.reportCount + 1,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reportOff = () => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/reports`,
      )
      .then((res) => {
        if (res.data === 1) {
          setReportInfo({
            ...reportInfo,
            isReport: 0,
            reportCount: reportInfo.reportCount - 1,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  */

  const loginMsg = () => {
    Swal.fire({ title: "로그인 후 이용 가능합니다.", icon: "info" });
  };

  const handleReportClick = () => {
    if (!memberId) {
      loginMsg();
      return;
    }
    if (reportInfo?.isReport === 1) {
      Swal.fire({
        title: "이미 신고된 게시물입니다.",
        icon: "warning",
      });
      return;
    }

    setIsReportModalOpen(true);
  };

  const submitReport = () => {
    if (reportReason.trim() === "") {
      Swal.fire("신고 사유를 입력해주세요.", "", "warning");
      return;
    }
    Swal.fire({
      title: "해당 게시글을 \n 정말로 신고하시겠습니까?",
      text: "신고 후에는 취소할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "신고",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--danger)",
      cancelButtonColor: "var(--primary)",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axios
        .post(
          `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/reports`,
          {
            reportReason: reportReason,
          },
        )
        .then((res) => {
          if (res.data === 1) {
            setReportInfo({
              ...reportInfo,
              isReport: 1,
              reportCount: reportInfo.reportCount + 1,
            });
            Swal.fire("신고가 접수되었습니다.", "", "success");
            setIsReportModalOpen(false);
            setReportReason("");
          }
        })
        .catch((err) => console.log(err));
    });
  };

  return (
    <div className={styles.community_like_dislike_report_wrap}>
      {likeInfo && (
        <div
          className={`${styles.community_like_wrap} ${
            likeInfo.isLike === 1 ? styles.active : ""
          }`}
        >
          {likeInfo.isLike === 1 ? (
            <ThumbUpAltIcon onClick={likeOff} />
          ) : (
            <ThumbUpOffAltIcon onClick={memberId ? likeOn : loginMsg} />
          )}
          <span>{likeInfo.likeCount}</span>
        </div>
      )}
      {dislikeInfo && (
        <div className={styles.community_dislike_wrap}>
          {dislikeInfo.isDislike === 1 ? (
            <ThumbDownAltIcon onClick={dislikeOff} />
          ) : (
            <ThumbDownOffAltIcon onClick={memberId ? dislikeOn : loginMsg} />
          )}
          <span>{dislikeInfo.dislikeCount}</span>
        </div>
      )}
      {memberId !== communityWriter && (
        <div className={styles.report_btn}>
          <Button className="btn danger" onClick={handleReportClick}>
            신고하기
          </Button>
        </div>
      )}
      {isReportModalOpen && (
        <div
          className={styles.overlay}
          // onClick={() => setIsReportModalOpen(false)}
        >
          <div
            className={styles.report_modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>게시글 신고하기</h3>

            <TextArea
              placeholder="신고 사유를 입력해주세요 (최대 200자 입력 가능)"
              value={reportReason}
              maxLength={200}
              onChange={(e) => {
                const value = e.target.value;

                setReportReason(value);
              }}
            />
            <div className={styles.text_count}>{reportReason.length} / 200</div>

            <div className={styles.modal_btn_wrap}>
              <Button className="btn danger" onClick={submitReport}>
                신고
              </Button>

              <Button
                className="btn light outline"
                onClick={() => setIsReportModalOpen(false)}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CommunityCommentComponent = ({ communityNo }) => {
  const { memberId } = useAuthStore();
  const [communityComment, setCommunityComment] = useState({
    communityCommentContent: "",
    communityCommentWriter: memberId,
    communityNo: communityNo,
    communityCommentNo2: "",
  });
  const [communityCommentList, setCommunityCommentList] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/communities/${communityNo}/comments`,
      )
      .then((res) => {
        console.log(res);
        setCommunityCommentList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const updateComment = (modifyComment, index) => {
    axios
      .put(
        `${import.meta.env.VITE_BACKSERVER}/communities/comments/${modifyComment.communityCommentNo}`,
        modifyComment,
      )
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          const newCommentList = [...communityCommentList];
          newCommentList[index].communityCommentContent =
            modifyComment.communityCommentContent;
          setCommunityCommentList(newCommentList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (communityCommentNo) => {
    axios
      .delete(
        `${import.meta.env.VITE_BACKSERVER}/communities/comments/${communityCommentNo}`,
      )
      .then((res) => {
        console.log(res);
        if (res.data === 1) {
          const newCommunityCommentList = communityCommentList.filter(
            (item) => {
              return communityCommentNo !== item.communityCommentNo;
            },
          );
          setCommunityCommentList(newCommunityCommentList);
        }
      });
  };

  const registComment = () => {
    if (communityComment.communityCommentContent === "") {
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/communities/comments`,
        communityComment,
      )
      .then((res) => {
        console.log(res);
        setCommunityCommentList([...communityCommentList, res.data]);
        setCommunityComment({
          ...communityComment,
          communityCommentContent: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.comment_wrap}>
      {memberId && (
        <div className={styles.comment_regist_wrap}>
          <h3>댓글 등록</h3>
          <div className={styles.input_item}>
            <TextArea
              value={communityComment.communityCommentContent}
              onChange={(e) => {
                setCommunityComment({
                  ...communityComment,
                  communityCommentContent: e.target.value,
                });
              }}
            ></TextArea>
            <Button className="btn primary" onClick={registComment}>
              등록
            </Button>
          </div>

          <div className={styles.community_comment_count_wrap}>
            <Comment className={styles.icon} />
            <h3>댓글 {communityCommentList.length}개</h3>
          </div>
        </div>
      )}
      <div className={styles.comment_list_wrap}>
        {communityCommentList.map((comment, index) => {
          return (
            <CommunityComment
              key={"comment-" + comment.communityCommentNo}
              comment={comment}
              index={index}
              updateComment={updateComment}
              deleteComment={deleteComment}
            />
          );
        })}
      </div>
    </div>
  );
};

const CommunityComment = ({ comment, index, updateComment, deleteComment }) => {
  const { memberId } = useAuthStore();
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [modifyComment, setModifyComment] = useState({
    communityCommentContent: comment.communityCommentContent,
    communityCommentNo: comment.communityCommentNo,
  });
  return (
    <ul className={styles.comment_item}>
      <li className={styles.comment_info}>
        <div className={styles.comment_writer_wrap}>
          <span>{comment.communityCommentWriter}</span>
        </div>
        <span className={styles.comment_date}>
          {comment.communityCommentDate}
        </span>
        {memberId &&
          memberId === comment.communityCommentWriter &&
          (isModifyMode ? (
            <>
              <Button
                className="btn primary sm"
                onClick={() => {
                  updateComment(modifyComment, index);
                  setIsModifyMode(false);
                }}
              >
                수정하기
              </Button>
              <Button
                className="btn primary outline sm"
                onClick={() => {
                  setModifyComment({
                    ...modifyComment,
                    communityCommentContent: comment.communityCommentContent,
                  });
                  setIsModifyMode(false);
                }}
              >
                수정 취소
              </Button>
            </>
          ) : (
            <>
              <Button
                className="btn primary"
                onClick={() => {
                  setIsModifyMode(true);
                }}
              >
                수정
              </Button>
              <Button
                className="btn light outline"
                onClick={() => {
                  Swal.fire({
                    title: "댓글을 삭제하시겠습니까?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "삭제",
                    cancelButtonText: "취소",
                    confirmButtonColor: "var(--primary)",
                    cancelButtonColor: "var(--danger)",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteComment(modifyComment.communityCommentNo);
                    }
                  });
                }}
              >
                삭제
              </Button>
            </>
          ))}
      </li>
      <li className={styles.comment_content}>
        <TextArea
          value={modifyComment.communityCommentContent}
          onChange={(e) => {
            setModifyComment({
              ...modifyComment,
              communityCommentContent: e.target.value,
            });
          }}
          disabled={!isModifyMode}
        ></TextArea>
      </li>
    </ul>
  );
};

export default CommunityViewPage;
