import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MarketListPage.module.css";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

const MarketListPage = () => {
  const navigate = useNavigate();
  const { memberId } = useAuthStore();
  const [marketList, setMarketList] = useState([]);

  /* 사이즈 셋팅 */
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);

  /* 공개상태 관리 스테이트 1 : 공개 2 : 비공개 */
  const [status, setStatus] = useState(1);

  /* 정렬관리 스테이트 */
  const [order, setOrder] = useState(0);
  /*
    0 : 최신순
    1 : 오래된순
    2 : 조회수 높은순
    3 : 좋아요 많은순
    4 : 금액 높은순
  */

  /* 화면표현용 스테이트 */
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState(1); //1:제목 2: 작성자

  /* 서버전송용 스테이트 */
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState(1);

  /* 지역 관리용 스테이트 0 : 강남구 1: 강동구 2: 강북구... */
  const [location, setLocation] = useState(0);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/markets?page=${page}&size=${size}&status=${status}&order=${order}&searchType=${searchType}&searchKeyword=${searchKeyword}&location=${location}`,
      )
      .then((res) => {
        console.log(res.data.items);
        setMarketList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log("에러발생");
        console.log(err.data);
      });
  }, [page, size, status, order, searchType, searchKeyword, location]);

  return (
    <>
      <section className={styles.market_wrap}>
        <div className={styles.market_searchbox}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchType(type);
              setSearchKeyword(keyword);
              setPage(0);
            }}
          >
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <option value={1}>제목</option>
              <option value={2}>작성자</option>
            </select>

            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            ></input>

            <Button className="btn primary" type="submit">
              검색
            </Button>
            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value);
                setPage(0);
              }}
            >
              <option value={0}>최신↓</option>
              <option value={1}>오래된↓</option>
              <option value={2}>조회수↓</option>
              <option value={3}>좋아요↓</option>
              <option value={4}>금액↓</option>
            </select>

            <select
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setPage(0);
              }}
            >
              <option value={8}>8개씩보기</option>
              <option value={16}>16개씩보기</option>
              <option value={32}>32개씩보기</option>
            </select>
            <Button
              className="btn primary danger"
              onClick={() => {
                setPage(0);
                setOrder(0);
                setLocation(0);
                setType(1);
                setKeyword("");
                setSize(8);
                setSearchType(1);
                setSearchKeyword("");
              }}
            >
              초기화
            </Button>
          </form>
        </div>

        <div className={styles.market_list_wrap}>
          <MarketList marketList={marketList} />
        </div>

        {/* 로그인시 글쓰기 필드 */}
        <div className={styles.market_writebox}>
          {memberId && (
            <Link to="/market/writeFrm">
              <Button className="btn primary">글작성</Button>
            </Link>
          )}
        </div>
        <div className={styles.market_pagination}>
          <Pagination
            page={page}
            totalPage={totalPage}
            naviSize={5}
            setPage={setPage}
          ></Pagination>
        </div>
      </section>
    </>
  );
};
export default MarketListPage;

const MarketList = ({ marketList }) => {
  return (
    <ul>
      {marketList.map((market) => {
        return (
          <MarketItem key={`market-list-${market.marketNo}`} market={market} />
        );
      })}
    </ul>
  );
};

const MarketItem = ({ market }) => {
  const navigate = useNavigate();
  /* 이미지 매핑 */
  const imgUrl = "http://192.168.31.24:9999/market";
  return (
    <li
      onClick={() => {
        navigate(`/market/view/${market.marketNo}`);
      }}
    >
      <div className={styles.market_info_wrap}>
        {market.marketThumb ? (
          <img
            src={`${imgUrl}/${market.marketThumb}`}
            alt={market.marketTitle}
          />
        ) : (
          <ImageNotSupportedIcon
            className={styles.ImageNotSupportedIcon}
            style={{ fontSize: "72pt" }}
          />
        )}
        <div className={styles.info}>
          <p>제목 : {market.marketTitle}</p>
          <p>작성일 : {market.marketDate.slice(0, 10)}</p>
          <p>작성자 : {market.marketWriter}</p>
          <p>조회수 : {market.viewCount}</p>

          <p>판매금액 : {market.sellPrice}</p>
        </div>
      </div>
    </li>
  );
};
