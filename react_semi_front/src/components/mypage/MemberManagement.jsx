import { useEffect, useState } from "react";
import styles from "./MemberManagement.module.css";
import { Input } from "../ui/Form";
import Button from "../ui/Button";
import Pagination from "../ui/Pagination";
import MemberList from "./MemberList";
import axios from "axios";

const MemberManagement = () => {
  const [type, setType] = useState(1);
  const [keyword, setKeyword] = useState(""); // 검색어
  const [order, setOrder] = useState(1); // 정렬 조건

  const [searchType, setSearchType] = useState(0); // 제출할 검색 조건
  const [searchKeyword, setSearchKeyword] = useState("");

  const [memberList, setMemberList] = useState([]);
  const [page, setPage] = useState(0); // 시작 숫자
  const [size, setSize] = useState(10); // 페이징 개수
  const [totalPage, setTotalPage] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/members?page=${page}&size=${size}&order=${order}&searchType=${searchType}&searchKeyword=${searchKeyword}`,
      )
      .then((res) => {
        console.log(res);
        setMemberList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, searchType, searchKeyword]);

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
          <option value={1}>아이디 오름차순</option>
          <option value={2}>아이디 내림차순</option>
          <option value={3}>이름 오름차순</option>
          <option value={4}>이름 내림차순</option>
        </select>
        <form
          className={styles.search}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchType(type);
            setSearchKeyword(keyword);
            setPage(0);
          }}
        >
          <select
            className={styles.select}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option value={1}>이름</option>
            <option value={2}>아이디</option>
            <option value={3}>이메일</option>
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
        </form>
      </div>
      <div className={styles.list_wrap}>
        <MemberList memberList={memberList} />
        <div className={styles.member_list_pagination}>
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
