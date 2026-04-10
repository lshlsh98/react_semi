import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MarketListPage.module.css";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MarketListPage = () => {
  const navigate = useNavigate();
  const { memberId } = useAuthStore();
  const [marketList, setMarketList] = useState([]);

  /* 사이즈 셋팅 */
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

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
        console.log("리스트 조회 실패");
        console.log(err);
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
              <option value={0}>최신순</option>
              <option value={1}>작성순</option>
              <option value={2}>조회수</option>
              <option value={3}>좋아요</option>
              <option value={4}>금액순</option>
            </select>

            <select
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setPage(0);
              }}
            >
              <option value={10}>10개씩보기</option>
              <option value={20}>20개씩보기</option>
              <option value={50}>50개씩보기</option>
            </select>
            <Button
              className="btn primary danger"
              onClick={() => {
                setPage(0);
                setOrder(0);
                setLocation(0);
                setType(1);
                setKeyword("");
                setSize(10);
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

  const timeAgo = (dateString) => {
    if (!dateString) {
      return "";
    }

    const postDate = new Date(dateString); // postDate : 게시글 올린 date(날짜, 시간등)
    const now = new Date(); // now : 지금(현재 날짜, 시간등)

    const diffInSeconds = Math.floor((now - postDate) / 1000); // 현재 시간과 게시글 시간의 차이를 초 단위로 계산

    if (diffInSeconds < 60) {
      return "방금 전";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else {
      // __.split(" ") : " " 즉 공백을 기준을 자름. 현재 dateString은 예시로 ["2026-04-03", "15:30:00"] 이런식으로 찍힘. 즉 날짜와 시간 사이에 공백이 있음.
      // 그중에 0번 즉 첫번쨰 값을 가져옴 -> 날짜 예시에서의 "2026-04-03"
      return dateString.split(" ")[0];
    }
  };

  const formatPrice = (price) => {
    if (price === 0) {
      return "무료나눔";
    }
    return price.toLocaleString() + "원"; // toLocaleString하면 현재 본인의 국가에 해당하는 숫자 표기법을 적용 (예 : 1000000 -> 1,000,000)
  };
  const viewCountUpAndMove = () => {
    console.log("조회수증가");
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/markets/${market.marketNo}/incrementViewCount`,
      )
      .then((res) => {
        if (res.data === 1) {
          navigate(`/market/view/${market.marketNo}`);
        }
      })
      .catch((err) => {
        console.log("조회수 증가 실패");
        navigate(`/market/view/${market.marketNo}`);
        console.log(err);
      });
  };

  return (
    <li onClick={viewCountUpAndMove}>
      <div className={styles.market_info_wrap}>
        {market.marketThumb ? (
          <img
            src={`${imgUrl}/${market.marketThumb}`}
            alt={market.marketTitle}
          />
        ) : (
          <ImageNotSupportedIcon
            className={styles.ImageNotSupportedIcon}
            style={{ height: "200px", width: "200px", fill: "var(--primary)" }}
          />
        )}
        <div className={styles.info}>
          <h3 className={styles.info_title}>{market.marketTitle}</h3>
          <p
            className={
              market.sellPrice === 0
                ? styles.info_price_free
                : styles.info_price
            }
          >
            {formatPrice(market.sellPrice)}
          </p>
          <p className={styles.info_date}>{timeAgo(market.marketDate)}</p>
          <p className={styles.info_writer}>{market.marketWriter}</p>
          <span className={styles.info_likeCount}>
            <FavoriteIcon className={styles.info_likeCount_icon} />
            {market.likeCount}
          </span>
          <p className={styles.info_viewCount}>조회수 : {market.viewCount}</p>

          <p className={styles.info_sellAddr}>{market.sellAddr}</p>
        </div>
      </div>
    </li>
  );
};
