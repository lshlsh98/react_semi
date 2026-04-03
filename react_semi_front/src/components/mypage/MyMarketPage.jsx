import { useEffect, useState } from "react";
import Pagination from "../ui/Pagination";
import styles from "./MyBoardPage.module.css";
import BasicSelect from "../ui/BasicSelect";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "../ui/Form";
import MyMarketList from "./board/MyMarketList";
import { useParams } from "react-router-dom";

const MyMarketPage = () => {
  const { isAdminMode } = useParams();

  const memberId = useAuthStore((state) => state.memberId);
  const memberGrade = useAuthStore((state) => state.memberGrade);

  const [boardList, setBoardList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(null);
  const [order, setOrder] = useState(0); // 0: 최신순 / 1: 작성순 / 2: 조회수 / 3: 좋아요 / 4: 신고수 / 5: 완료순
  const [status, setStatus] = useState(0); // 0: 전체 / 1: 공개 / 2: 비공개
  const [completed, setCompleted] = useState(2); // 2: 전체 / 1: 완료 / 0: 미완료
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/mypages/board/market?isAdminMode=${isAdminMode}&page=${page}&size=${size}&order=${order}&status=${status}&completed=${completed}&searchKeyword=${searchKeyword}&memberId=${memberId}&memberGrade=${memberGrade}`,
      )
      .then((res) => {
        console.log(res);
        setBoardList(res.data.list);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, status, searchKeyword, completed]);

  useEffect(() => {
    setPage(0);
  }, [order, status, searchKeyword, completed]);

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
            state={completed}
            setState={setCompleted}
            list={[
              [2, "전체"],
              [1, "완료"],
              [0, "미완료"],
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
              [4, "신고수"],
              [5, "최근완료"],
            ]}
          />
        </div>
      </div>
      <div className={styles.myboard_list_content}>
        <MyMarketList
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

export default MyMarketPage;
