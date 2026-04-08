import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import FavoriteIcon from "@mui/icons-material/Favorite";

// 시간 계산 함수 ("n분 전", "n시간 전" 표시) - 아래의 중고거래, 커뮤니티 둘다 이걸 쓰기 위해 밖에 선언
const timeAgo = (dateString) => {
  // 받은 시간값이 없으면 return
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

const MainPage = () => {
  const [recentItems, setRecentItems] = useState([]); // 방금 올라온 물건 (최신순-중고거래)
  const [hotItems, setHotItems] = useState([]); // 핫한 물건 (조회수순-중고거래)

  const [popularCommunity, setPopularCommunity] = useState([]); // 커뮤니티 인기글 (좋아요순)
  const [noticeCommunity, setNoticeCommunity] = useState([]); // 커뮤니티 공지사항 (공지사항 -> 회원등급 : 1-슈퍼관리자, 2-관리자 order by 최신순)

  useEffect(() => {
    // 1. 방금 올라온 따끈따끈한 물건 (order=0: 최신순, MarketListPage의 order와 동일하게 씀(안헷갈리게. 물론 메인페이지랑 마켓페이지는 아예 상관없지만 그래두 그냥))
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/main?order=0`)
      .then((res) => {
        setRecentItems(res.data);
      })
      .catch((err) => {
        console.log("최신 목록 로딩 실패:", err);
      });

    // 2. 지금 동네에서 가장 핫한 물건 (order=2: 조회수순, 이것도 MarketListPage와 동일하게)
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/main?order=2`)
      .then((res) => {
        setHotItems(res.data);
      })
      .catch((err) => {
        console.log("핫한 목록 로딩 실패:", err);
      });

    // 3. 커뮤니티 인기글
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/communities/main?type=popular`)
      .then((res) => {
        setPopularCommunity(res.data);
      })
      .catch((err) => {
        console.log("인기글 로딩 실패:", err);
      });

    // 4. 커뮤니티 공지사항
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/communities/main?type=notice`)
      .then((res) => {
        setNoticeCommunity(res.data);
      })
      .catch((err) => {
        console.log("공지사항 로딩 실패:", err);
      });
  }, []);

  return (
    <div className={styles.main_wrap}>
      {/* 1. 방금 올라온 물건 */}
      <MarketSection
        title="방금 올라온 따끈따끈한 물건"
        highlightWord="따끈따끈한"
        items={recentItems}
      />

      {/* 2. 가장 핫한 물건 */}
      <MarketSection
        title="지금 동네에서 가장 핫한 물건"
        highlightWord="가장 핫한"
        items={hotItems}
      />
      <div className={styles.community_wrap}>
        {/* 왼쪽: 3. 인기글 */}
        <CommunitySection title="커뮤니티 인기글" items={popularCommunity} />
        {/* 오른쪽: 4. 공지사항 */}
        <CommunitySection title="커뮤니티 공지사항" items={noticeCommunity} />
      </div>
    </div>
  );
};

// 컴포넌트로 만들어서 관리 (다른곳에서는 안쓰이니 그냥 여기에 만듬)
const MarketSection = ({ title, highlightWord, items }) => {
  const navigate = useNavigate();

  // 가격 0원이면 무료나눔, 아니면 콤마 찍기
  const formatPrice = (price) => {
    if (price === 0) {
      return "무료나눔";
    }
    return price.toLocaleString() + "원"; // toLocaleString하면 현재 본인의 국가에 해당하는 숫자 표기법을 적용 (예 : 1000000 -> 1,000,000)
  };

  return (
    <section className={styles.section_box}>
      <div className={styles.section_header}>
        <h2 className={styles.title}>
          {/* 1. 앞부분 조각: "방금 올라온", "지금 동네에서" (highlightWord를 기준으로 title을 쪼개면 두개로 나뉨) */}
          {title.split(highlightWord)[0]}

          {/* 2. 잘려나갔던 가위 단어("따끈따근한", "가장 핫한")에 초록색 옷을 입혀서 가운데 쏙 넣기 */}
          <span className={styles.highlight}>{highlightWord}</span>

          {/* 3. 뒷부분 조각: " 물건" */}
          {title.split(highlightWord)[1]}
        </h2>
        <Link to="/market" className={styles.more_link}>
          {/* > : 이거 그냥은 문자를 못널네? */}
          더보기 {">"}
        </Link>
      </div>

      <ul className={styles.card_list}>
        {items.map((item) => (
          <li
            key={`main_market-${item.marketNo}`}
            className={styles.card}
            onClick={() => navigate(`/market/view/${item.marketNo}`)}
          >
            <div className={styles.img_box}>
              {item.marketThumb ? (
                <img
                  src={`${import.meta.env.VITE_IMAGE_SERVER}/${item.marketThumb}`}
                  alt={item.marketTitle}
                />
              ) : (
                <div className={styles.fallback_box}>
                  <ImageNotSupportedIcon className={styles.iconFallback} />
                  <span>물품 사진</span>
                </div>
              )}
            </div>

            <div className={styles.info_box}>
              <h3 className={styles.item_title}>{item.marketTitle}</h3>
              <p
                className={
                  item.sellPrice === 0 ? styles.price_free : styles.item_price
                }
              >
                {/* 아까 숫자 표기법 적용, 0원이면 무료나눔만든 formatPrice 함수*/}
                {formatPrice(item.sellPrice)}
              </p>

              <div className={styles.meta_box}>
                <span className={styles.time_view}>
                  {/* timeAgo : 아까만든 시간계산함수 / 가운데 점은 ㅁ한자로 했는데(집에서) 학원에서 ㅁ한자가 조금 다르길래 그냥 구글에 가운데 점이라 치고 복붙  */}
                  {timeAgo(item.marketDate)} · 조회수: {item.viewCount}
                </span>
                <span className={styles.like_count}>
                  <FavoriteIcon className={styles.heart_icon} />
                  {item.likeCount || 0}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

// 커뮤니티 컴포넌트 (이것도 여기서만 쓰니 여기에 만듬)
const CommunitySection = ({ title, items }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.comm_section_box}>
      <div className={styles.section_header}>
        <h2 className={styles.title}>{title}</h2>
        <Link to="/community" className={styles.more_link}>
          더보기 {">"}
        </Link>
      </div>

      <ul className={styles.comm_list}>
        {items.map((item) => (
          <li
            key={`main_comm-${item.communityNo}`}
            className={styles.comm_card}
            onClick={() => navigate(`/community/view/${item.communityNo}`)}
          >
            <h3 className={styles.comm_item_title}>{item.communityTitle}</h3>

            <ConvertContent communityContent={item.communityContent} />

            <div className={styles.comm_meta_box}>
              <span>작성자: {item.communityWriter}</span>
              <span className={styles.divider}>|</span>

              {/* timeAgo : 앞에서 시간계산함수*/}
              <span>{timeAgo(item.communityDate)}</span>

              <span className={styles.divider}>|</span>

              <span className={styles.like_count}>
                <FavoriteIcon className={styles.heart_icon} />
                {item.likeCount}
              </span>
              <span className={styles.divider}>|</span>

              <span>조회수: {item.viewCount}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

// HTML 태그 제거 컴포넌트
const ConvertContent = ({ communityContent }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(communityContent, "text/html");
  const text = doc.body.textContent || "";

  // 메인 페이지의 CSS 클래스 styles.comm_item_content 적용
  return <p className={styles.comm_item_content}>{text}</p>;
};

export default MainPage;
