import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import MyBoardList from "./board/MyBoardList";
import styles from "./MyBoardPage.module.css";
import BasicSelect from "../ui/BasicSelect";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "../ui/Form";
import { useParams } from "react-router-dom";

const LikeDislike = () => {
  const memberId = useAuthStore((state) => state.memberId);
  const [boardList, setBoardList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(null);
  const [order, setOrder] = useState(0); // 0: 최신순 / 1: 작성순 / 2: 조회수 / 3: 좋아요 / 4: 싫어요 / 5: 신고수
  const [status, setStatus] = useState(0); // 0: 전체 / 1: 좋아요 / 2: 싫어요

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/mypages/board/likedislike?page=${page}&size=${size}&order=${order}&status=${status}&memberId=${memberId}`,
      )
      .then((res) => {
        console.log("here111111111");
        console.log(res);
        // setBoardList(res.data.list);
        // setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, status]);

  useEffect(() => {
    setPage(0);
  }, [order, status]);

  return (
    <div className={styles.myboard_wrap}>
      <div className={styles.filter_section}>
        <div className={styles.filter_select}>
          <BasicSelect
            state={status}
            setState={setStatus}
            list={[
              [0, "전체"],
              [1, "좋아요"],
              [2, "싫어요"],
            ]}
          />
          <BasicSelect
            state={order}
            setState={setOrder}
            list={[
              [0, "최신순"],
              [1, "작성순"],
              [2, "조회수"],
              [3, "좋아요"],
              [4, "싫어요"],
              [5, "신고수"],
            ]}
          />
        </div>
      </div>
      <div className={styles.myboard_list_content}>
        {/* <MyBoardList
          boardList={boardList}
          setBoardList={setBoardList}
          status={status}
          isAdminMode={isAdminMode}
        /> */}
      </div>
      <div className={styles.pagination_section}>
        <Pagination
          totalPage={totalPage}
          page={page}
          setPage={setPage}
          naviSize={5}
        />
      </div>
    </div>
  );
};

export default LikeDislike;
