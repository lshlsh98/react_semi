import { useEffect, useState } from "react";
import BasicSelect from "../ui/BasicSelect";
import styles from "./MyCommentPage.module.css";
import Pagination from "../ui/Pagination";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";
import MyCommentItem from "./comment/MyCommentItem";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import { useParams } from "react-router-dom";

const MyMarketCommentPage = () => {
  const { isAdminMode } = useParams();

  const memberId = useAuthStore((state) => state.memberId);
  const memberGrade = useAuthStore((state) => state.memberGrade);

  const [commentList, setCommentList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(null);
  const [order, setOrder] = useState(0); // 0: 최신순 / 1: 작성순 / 2: 싫어요
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/mypages/comment/market?isAdminMode=${isAdminMode}&page=${page}&size=${size}&order=${order}&searchKeyword=${searchKeyword}&memberId=${memberId}&memberGrade=${memberGrade}`,
      )
      .then((res) => {
        setCommentList(res.data.list);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, searchKeyword]);

  useEffect(() => {
    setPage(0);
  }, [order, searchKeyword]);

  return (
    <div className={styles.mycomment_wrap}>
      <div className={styles.filter_section}>
        {isAdminMode === "false" ? (
          ""
        ) : (
          <div className={styles.filter_input}>
            <Input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              placeholder="회원명 검색"
            />
            <SearchIcon
              className={styles.search_icon}
              onClick={() => {
                setSearchKeyword(keyword);
              }}
            />
          </div>
        )}
        <div className={styles.filter_select}>
          <BasicSelect
            state={order}
            setState={setOrder}
            list={[
              [0, "최신순"],
              [1, "작성순"],
              [2, "신고순"],
            ]}
          />
        </div>
      </div>
      <div className={styles.mycomment_list_content}>
        <div className={styles.mycomment_list_wrap}>
          {commentList.map((comment, index) => (
            <MyCommentItem
              key={comment.commentNo}
              comment={comment}
              index={index}
              commentList={commentList}
              setCommentList={setCommentList}
              type="market"
              isAdminMode={isAdminMode}
            />
          ))}
        </div>
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

export default MyMarketCommentPage;
