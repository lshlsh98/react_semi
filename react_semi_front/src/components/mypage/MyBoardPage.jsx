import { useState } from "react";
import Pagination from "../ui/Pagination";
import MyBoardList from "./board/MyBoardList";
import styles from "./MyBoardPage.module.css";
import BasicSelect from "../ui/BasicSelect";

const MyBoardPage = () => {
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(10);
  const [order, setOrder] = useState(0); // 0: 기본 1: 중급 2: 고급

  return (
    <div className={styles.myboard_wrap}>
      <div className={styles.filter_section}>
        <div className={styles.filter_select}>
          <BasicSelect
            state={order}
            setState={setOrder}
            list={[
              [0, "기본"],
              [1, "중급"],
              [2, "고급"],
            ]}
          />
        </div>
      </div>
      <div className={styles.myboard_list_content}>
        {/* 일반 인원의 경우 보여지는 페이지와 관리자인 경우 보여지는 페이지를 나누어서 */}
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
