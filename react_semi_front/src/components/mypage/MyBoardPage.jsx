import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import MyBoardList from "./board/MyBoardList";
import styles from "./MyBoardPage.module.css";
import BasicSelect from "../ui/BasicSelect";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";

const MyBoardPage = () => {
  const memberId = useAuthStore((state) => state.memberId);
  const memberGrade = useAuthStore((state) => state.memberGrade);

  const [boardList, setBoardList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(null);
  const [order, setOrder] = useState(0); // 0: 최신순 / 1: 작성순 / 2: 조회수 / 3: 좋아요 / 4: 싫어요 / 5: 신고수

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/mypages/board/community?page=${page}&size=${size}&order=${order}&memberId=${memberId}&memberGrade=${memberGrade}`,
      )
      .then((res) => {
        console.log(res);
        // setBoardList(res.data.items);
        // setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order]);

  return (
    <div className={styles.myboard_wrap}>
      <div className={styles.filter_section}>
        <div className={styles.filter_select}>
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
        <MyBoardList />
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

export default MyBoardPage;
