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
  const navigate = useNavigate();

  const [recentItems, setRecentItems] = useState([]); // 방금 올라온 물건 (최신순-중고거래)
  const [hotItems, setHotItems] = useState([]); // 핫한 물건 (조회수순-중고거래)

  const [popularCommunity, setPopularCommunity] = useState([]); // 커뮤니티 인기글 (좋아요순)
  const [noticeCommunity, setNoticeCommunity] = useState([]); // 커뮤니티 공지사항 (공지사항 -> 회원등급 : 1-슈퍼관리자, 2-관리자 order by 최신순)

  const [currentBanner, setCurrentBanner] = useState(0); // 현재 배너의 번호

  // 배너 데이터 배열 (id : 배너 번호, img : 경로, title : 제목, link : route해서 갈 주소)
  const bannerList = [
    { id: 1, img: "/banner1.png", title: "그린리턴 중고거래", link: "/market" },
    { id: 2, img: "/banner2.png", title: "그린 커뮤니티", link: "/community" },
    { id: 3, img: "/banner3.png", title: "그린리턴 맵", link: "/map" },
    { id: 4, img: "/banner4.png", title: "탄소절감 캠페인" },
  ];

  // 4초마다 배너가 자동으로 넘어가게 하는 타이머
  useEffect(() => {
    let timerId; // 몇번 타이머인지 구분하기 위해 지정

    // 자동으로 슬라이드 넘기는 함수
    const startAutoSlide = () => {
      // timerId에 값 대입할거고 setInterval()은 n초마다 작업 반복하는것
      timerId = setInterval(() => {
        // 지금 배너가 마지막 배너면 0번으로 가고, 아니면 다음(+1)으로 가기
        setCurrentBanner((prev) =>
          prev === bannerList.length - 1 ? 0 : prev + 1,
        );
      }, 4000); // 4000ms = 4초마다
    };

    const stopAutoSlide = () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };

    startAutoSlide(); // 컴포넌트 마운트 시 타이머 시작

    // 수동 이동 시, 자동으로 넘어가는 타이머를 초기화하고 4초 뒤에 다시 시작하는 함수
    const manualMove = (type) => {
      stopAutoSlide(); // 수동 이동 직후 자동 이동 멈춤

      if (type === "prev") {
        setCurrentBanner((prev) =>
          prev === 0 ? bannerList.length - 1 : prev - 1,
        );
      } else {
        setCurrentBanner((prev) =>
          prev === bannerList.length - 1 ? 0 : prev + 1,
        );
      }

      startAutoSlide(); // 4초 뒤에 다시 자동 이동 시작
    };

    // 이 manualMove 함수를 외부에 노출시키기 위해 ref 등을 활용할 수 있지만,
    // 이 방식은 코드가 복잡해지므로, 일단은 onClick 로직에 clearInterval만 추가하는 방식으로 가겠습니다.
    // 대신에, 수동 이동 후 일정 시간 동안 자동 이동을 멈추는 로직을 추가할 수 있습니다.

    return () => stopAutoSlide(); // 컴포넌트가 사라질 때 타이머 청소
  }, [currentBanner, bannerList.length]);

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
      {/* 🚀 3. 메인 배너 슬라이더 영역 추가 (수정됨) */}
      <section className={styles.banner_section}>
        <div
          className={styles.banner_slider}
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {bannerList.map((banner, index) => (
            <div
              key={`banner-${banner.id}`}
              className={styles.banner_slide}
              onClick={() => navigate(banner.link)} // 클릭 시 해당 페이지로 이동
            >
              <img
                src={banner.img}
                alt={banner.title}
                className={styles.banner_img}
              />
            </div>
          ))}
        </div>

        {/* 🚀 4. 배너 양옆 화살표 버튼 추가 (개선됨) */}
        <div className={styles.banner_btn_wrap}>
          <button
            className={styles.prev_btn}
            onClick={() => {
              // 타이머가 동작 중이라면 초기화 (clearInterval은 타이머 ID를 알아야 하므로
              // setInterval을 state로 관리하거나 ref로 관리해야 합니다.
              // 이 방식은 코드가 복잡해지므로, 일단은 onClick 로직에 clearInterval만 추가하는 방식으로 가겠습니다.)

              // 대신에, 사용자가 넘긴 직후에 자동으로 넘어가는 것을 방지하기 위해,
              // 수동 이동 후 일정 시간 동안 자동 이동을 멈추는 로직을 추가할 수 있습니다.

              setCurrentBanner((prev) =>
                prev === 0 ? bannerList.length - 1 : prev - 1,
              );
            }}
          >
            <span className="material-icons">chevron_left</span>
          </button>
          <button
            className={styles.next_btn}
            onClick={() => {
              setCurrentBanner((prev) =>
                prev === bannerList.length - 1 ? 0 : prev + 1,
              );
            }}
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </div>

        {/* 하단 동그라미 네비게이션 (현재 몇 번째 배너인지 표시) */}
        <div className={styles.banner_dots}>
          {bannerList.map((_, index) => (
            <div
              key={`dot-${index}`}
              className={`${styles.dot} ${currentBanner === index ? styles.active_dot : ""}`}
              onClick={() => setCurrentBanner(index)} // 동그라미 누르면 해당 배너로 이동
            ></div>
          ))}
        </div>
      </section>

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
        {/* 왼쪽: 3. 인기글 viewType=1(게시글)을 보냄*/}
        <CommunitySection
          title="커뮤니티 인기글"
          items={popularCommunity}
          viewType={1}
        />
        {/* 오른쪽: 4. 공지사항 viewType=2(공지사항)을 보냄*/}
        <CommunitySection
          title="커뮤니티 공지사항"
          items={noticeCommunity}
          viewType={2}
        />
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
const CommunitySection = ({ title, items, viewType }) => {
  const navigate = useNavigate();

  const moreLink = viewType === 1 ? "/community?view=1" : "/community?view=2";

  return (
    <section className={styles.comm_section_box}>
      <div className={styles.section_header}>
        <h2 className={styles.title}>{title}</h2>
        <Link to={moreLink} className={styles.more_link}>
          더보기 {">"}
        </Link>
      </div>

      <ul className={styles.comm_list}>
        {items.map((item) => (
          <li
            key={`main_comm-${item.communityNo}`}
            className={styles.comm_card}
            // 마켓과 커뮤니티의 조회수 증가하는 방식이 달라서 커뮤니티에만 클릭시 조회수 증가 함수
            onClick={async () => {
              try {
                // axios는 기존에 비동기이기에 서버요청을 던지고 다음코드로 넘어가지만 await를 하면 서버에서 데이터를 줄때까지 다음코드로 넘어가지않고 기다림.
                // 댓글에서 쓴 return과의 차이는 return은 데이터를 받고 바로 함수를 호출한 곳으로 값을 넘김.(애초에 자바든 파이썬이든 return의 하는일이 이거긴함.)
                // 반면 await는 return으로 어디에 값을 보내거나 하지 않음. 값을 보낼필요없을때 return대신 await를 쓴다고 생각하면 편함(100%는 아님. 보통은 그 함수 안에서 바로 데이터를 조작하거나, 조건문을 걸거나, 다음 동작(navigate 등)을 이어서 해야 할 때 쓴다고 함.)
                await axios.patch(
                  `${import.meta.env.VITE_BACKSERVER}/communities/view/${item.communityNo}`,
                  item,
                );
              } catch (err) {
                console.error(err);
              }
              // 통신이 성공하든 실패하든 상세 페이지로는 무조건 이동
              navigate(`/community/view/${item.communityNo}`);
            }}
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
