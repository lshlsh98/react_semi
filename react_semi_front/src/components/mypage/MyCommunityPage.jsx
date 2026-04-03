import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import MyBoardList from "./board/MyBoardList";
import styles from "./MyBoardPage.module.css";
import BasicSelect from "../ui/BasicSelect";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "../ui/Form";

const MyCommunityPage = () => {
  const memberId = useAuthStore((state) => state.memberId);
  const memberGrade = useAuthStore((state) => state.memberGrade);

  const [boardList, setBoardList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(null);
  const [order, setOrder] = useState(0); // 0: 최신순 / 1: 작성순 / 2: 조회수 / 3: 좋아요 / 4: 싫어요 / 5: 신고수
  const [status, setStatus] = useState(0); // 0: 전체 / 1: 공개 / 2: 비공개
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/mypages/board/community?page=${page}&size=${size}&order=${order}&status=${status}&searchKeyword=${searchKeyword}&memberId=${memberId}&memberGrade=${memberGrade}`,
      )
      .then((res) => {
        console.log(res.data.list);
        setBoardList(res.data.list);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, status, searchKeyword]);

  useEffect(() => {
    setPage(0);
  }, [order, status, searchKeyword]);

  return (
    <div className={styles.myboard_wrap}>
      <div className={styles.filter_section}>
        {memberGrade === 3 ? (
          ""
        ) : (
          <div className={styles.filter_input}>
            <Input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
            <SearchIcon
              onClick={() => {
                setSearchKeyword(keyword);
              }}
            />
          </div>
        )}

        <div className={styles.filter_select}>
          <BasicSelect
            state={status}
            setState={setStatus}
            list={[
              [0, "전체"],
              [1, "공개"],
              [2, "비공개"],
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
        <MyBoardList
          boardList={boardList}
          setBoardList={setBoardList}
          status={status}
        />
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

export default MyCommunityPage;
