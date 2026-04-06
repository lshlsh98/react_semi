import { useState } from "react";
import styles from "./MemberManagement.module.css";
import { Input } from "../ui/Form";
import Button from "../ui/Button";
import Pagination from "../ui/Pagination";

const MemberManagement = () => {
  const [type, setType] = useState(1); // 1:제목 2:작성자
  const [keyword, setKeyword] = useState(""); // 검색어
  const [order, setOrder] = useState(1); // 정렬 조건

  const [searchType, setSearchType] = useState(1); // 제출할 검색 조건
  const [searchKeyword, setSearchKeyword] = useState("");

  const [communityList, setCommunityList] = useState([]);
  const [page, setPage] = useState(0); // 시작 숫자
  const [size, setSize] = useState(10); // 페이징 개수
  const [totalPage, setTotalPage] = useState(null);

  return (
    <div className={styles.member_management}>
      <h3 className="page-title">회원 관리</h3>
      <div className={styles.search_wrap}>
        <select
          className={styles.select}
          value={order}
          onChange={(e) => {
            setOrder(e.target.value);
          }}
        >
          <option value={1}>최신순</option>
          <option value={2}>작성순</option>
          <option value={3}>조회수</option>
          <option value={4}>좋아요</option>
          <option value={5}>싫어요</option>
          <option value={6}>신고수</option>
        </select>
        <select
          className={styles.select}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
          }}
        >
          <option value={1}>글/내용</option>
          <option value={2}>작성자</option>
        </select>
        <Input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        ></Input>
        <Button type="submit" className="btn primary">
          <span className="material-icons">search</span>
        </Button>
      </div>
      <div className={styles.list_wrap}>
        <div className={styles.community_list_pagination}>
          <Pagination
            page={page}
            setPage={setPage}
            totalPage={totalPage}
            naviSize={5}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
