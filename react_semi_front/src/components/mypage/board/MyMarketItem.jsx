import styles from "./MyBoardItem.module.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import ReportIcon from "@mui/icons-material/Report";
import { useState } from "react";
import Switch from "@mui/material/Switch";
import axios from "axios";
import Swal from "sweetalert2";
import ReportModal from "../ReportModal";

const MyMarketItem = ({
  board,
  index,
  boardList,
  setBoardList,
  status,
  isAdminMode,
}) => {
  const [contentStatus, setContentStatus] = useState(board.contentStatus);

  const changeStatus = () => {
    const toggle = contentStatus === 1 ? 2 : 1;
    const obj = { boardNo: board.boardNo, status: toggle };

    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/mypages/board/market/${board.boardNo}`,
        obj,
      )
      .then((res) => {
        if (res.data === 1 && status !== 0) {
          const newBoardList = boardList.filter((b, i) => {
            return i !== index;
          });
          setBoardList(newBoardList);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setContentStatus(toggle);
  };

  const deleteBoard = () => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "삭제 시 정보를 복구할 수 없습니다",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/mypages/board/market/${board.boardNo}`,
          )
          .then((res) => {
            if (res.data === 1) {
              const newBoardList = boardList.filter((b, i) => {
                return i !== index;
              });
              setBoardList(newBoardList);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div
      className={styles.item}
      onClick={() => {
        console.log(board.boardNo);
      }}
    >
      <div className={styles.item_wrap}>
        {board.boardType ? (
          board.boardType === "market" ? (
            <div className={styles.board_type}>거래 게시판</div>
          ) : (
            <div className={styles.board_type}>커뮤니티 게시판</div>
          )
        ) : (
          ""
        )}
        <div className={styles.item_title}>{board.title}</div>
        <div className={styles.item_info}>
          <div>{`${board.writerName} [${board.writerId}]`}</div>
          <div>{board.contentDate}</div>
        </div>
        <div className={styles.item_actions}>
          <Actions board={board} isAdminMode={isAdminMode} />
        </div>
        <div className={styles.views_done}>
          <div className={styles.views}>조회수: {board.viewCount}</div>
          <div className={styles.done}>
            <div>{board.isCompleted === 1 ? "완료" : "미완료"}</div>
            {board.isCompleted === 1 ? <div>[{board.completedDate}]</div> : ""}
          </div>
        </div>
      </div>
      {isAdminMode === "false" ? (
        ""
      ) : (
        <div className={styles.admin_section}>
          <Switch
            className={styles.switch}
            sx={{
              "& .MuiSwitch-thumb": {
                color: "var(--primary)",
              },
              "& .MuiSwitch-track": {
                backgroundColor: "var(--gray3)",
              },
            }}
            checked={contentStatus === 1}
            onChange={changeStatus}
          />
          <div className={styles.btn_section}>
            <div
              className={styles.btn}
              onClick={() => {
                deleteBoard();
              }}
            >
              삭제
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Actions = ({ board, isAdminMode }) => {
  const [open, setOpen] = useState(false);

  const showReport = () => {
    if (board.reportCount <= 0 || isAdminMode === "false") {
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <div
        className={board.isLiked === 1 ? styles.isLiked : styles.action_default}
      >
        <ThumbUpIcon />
        <div>{board.likeCount}</div>
      </div>
      <div
        className={
          board.isCommented === 1 ? styles.isCommented : styles.action_default
        }
      >
        <CommentIcon />
        <div>{board.commentCount}</div>
      </div>
      <div
        className={`${styles.item_actions_report} ${board.isReported === 1 ? styles.isReported : styles.action_default}`}
        onClick={(e) => {
          e.stopPropagation();
          showReport();
        }}
      >
        <ReportIcon />
        <div>{board.reportCount}</div>
      </div>

      {/* 모달 */}
      {open && (
        <div
          className={styles.modal_overlay}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            <ReportModal board={board} tblName="market" />
          </div>
        </div>
      )}
    </>
  );
};

export default MyMarketItem;
