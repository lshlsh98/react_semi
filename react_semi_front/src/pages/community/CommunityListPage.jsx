import { useEffect, useState } from "react";
import styles from "./CommunityListPage.module.css";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import useAuthStore from "../../components/utils/useAuthStore";
import { useNavigate } from "react-router-dom";
import CommunityList from "../../components/community/CommunityList";
import axios from "axios";
import BasicSelect from "../../components/ui/BasicSelect";

const CommunityListPage = () => {
  const navigete = useNavigate();
  const { memberId } = useAuthStore();

  const [type, setType] = useState(1); // 1:제목 2:작성자
  const [keyword, setKeyword] = useState(""); // 검색어
  const [order, setOrder] = useState(1); // 정렬 조건
  const [view, setView] = useState(1);

  const [searchType, setSearchType] = useState(1); // 제출할 검색 조건
  const [searchKeyword, setSearchKeyword] = useState(""); // 제출할 검색어

  const [communityList, setCommunityList] = useState([]);
  const [page, setPage] = useState(0); // 시작 숫자
  const [size, setSize] = useState(10); // 페이징 개수
  const [totalPage, setTotalPage] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/communities?page=${page}&size=${size}&status=1&order=${order}&view=${view}&searchType=${searchType}&searchKeyword=${searchKeyword}`,
      )
      .then((res) => {
        console.log(res);
        setCommunityList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, searchType, searchKeyword, view]);

  return (
    <section className={styles.community_page_wrap}>
      <h3 className="page-title">커뮤니티</h3>
      <div className={styles.community_wrap}></div>
      <div className={styles.input_wrap}>
        <form
          className={styles.search_wrap}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchType(type);
            setSearchKeyword(keyword);
            setPage(0);
          }}
        >
          <BasicSelect
            state={type}
            setState={setType}
            onChange={(e) => {
              setPage(0);
            }}
            list={[
              [1, "글/내용"],
              [2, "작성자"],
            ]}
          />
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
        <div className={styles.order_item_wrap}>
          <BasicSelect
            state={view}
            setState={setView}
            onChange={(e) => {
              setPage(0);
            }}
            list={[
              [1, "게시글"],
              [2, "공지사항"],
            ]}
          />
          <div className={styles.order_wrap}>
            {memberId && (
              <div className={styles.write_btn_zone}>
                <Button
                  className="btn primary"
                  onClick={() => {
                    navigete("/community/write");
                  }}
                >
                  글쓰기
                </Button>
              </div>
            )}
            <BasicSelect
              state={order}
              setState={setOrder}
              onChange={(e) => {
                setPage(0);
              }}
              list={[
                [1, "최신순"],
                [2, "작성순"],
                [3, "조회수"],
                [4, "좋아요"],
                [5, "싫어요"],
                [6, "신고수"],
              ]}
            />
          </div>
        </div>
      </div>
      <div className={styles.list_wrap}>
        <CommunityList communityList={communityList} view={view} />
        <div className={styles.community_list_pagination}>
          <Pagination
            page={page}
            setPage={setPage}
            totalPage={totalPage}
            naviSize={5}
          />
        </div>
      </div>
    </section>
  );
};

export default CommunityListPage;
