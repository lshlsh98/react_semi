import styles from "./MypageMain.module.css";
import { useEffect, useState } from "react";
import useAuthStore from "../utils/useAuthStore";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MypageMain = () => {
  const { memberId } = useAuthStore();
  const [data, setData] = useState([]);
  const [memberScore, setMemberScore] = useState(0);
  const [myBestPost, setMyBestPost] = useState([]);
  const [myRecentPost, setMyRecentPost] = useState([]);

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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/mypages/today/${memberId}`)
      .then((res) => {
        console.log(res);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {
        setMemberScore(res.data.memberScore);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/mypages/my-best/${memberId}`)
      .then((res) => {
        setMyBestPost(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/mypages/my-recent/${memberId}`)
      .then((res) => {
        setMyRecentPost(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className={styles.member_info_wrap}>
      <h3 className="page-title">활동 기록</h3>
      <CarbonContributionView memberScore={memberScore} />
      <ChartComponent data={data} />
      <div className={styles.community_wrap}>
        <MyPost
          title="나의 인기글"
          memberId={memberId}
          myPost={myBestPost}
          timeAgo={timeAgo}
        />
        <MyPost
          title="나의 최근글"
          memberId={memberId}
          myPost={myRecentPost}
          timeAgo={timeAgo}
        />
      </div>
    </section>
  );
};

const CarbonContributionView = ({ memberScore }) => {
  return (
    <section className={styles.carbon_contribution_wrap}>
      <p>나의 탄소 기여도</p>
      <div className={styles.carbon_contribution}>
        <p>{memberScore}P</p>
      </div>
    </section>
  );
};

const ChartComponent = ({ data }) => {
  return (
    <section className={styles.chart_item_wrap}>
      <div className={styles.chart_title}>
        <p>나의 게시글 통계</p>
        <div className={styles.chart_wrap}>
          <ResponsiveContainer width="100%" height={300} tabIndex={-1}>
            <LineChart
              data={data}
              margin={{ left: 0, right: 20, top: 10 }}
              tabIndex={-1}
            >
              <XAxis
                dataKey="today"
                interval={0}
                tick={{ fontSize: 15 }}
                padding={{ left: 30, right: 20 }}
                height={50}
                tabIndex={-1}
              />
              <YAxis hide />
              <Tooltip />
              <Legend />
              <Line
                type="linear"
                dataKey="communityCount"
                name="커뮤니티"
                stroke="var(--gray3)"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />

              <Line
                type="linear"
                dataKey="marketCount"
                name="중고거래"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

const MyPost = ({ title, memberId, myPost, timeAgo }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.comm_section_box}>
      <div className={styles.section_header}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <ul className={styles.comm_list}>
        {myPost.map((post) =>
          post.communityNo === 0 ? (
            <li
              key={`my-post-${post.rn}`}
              className={styles.comm_card}
              onClick={() => navigate(`/market/view/${post.marketNo}`)}
            >
              <h3 className={styles.comm_item_title}>
                {post.rn}. [중고거래] {post.marketTitle}
              </h3>

              <div className={styles.comm_meta_box}>
                <span className={styles.writer}>작성자: {memberId}</span>
                <span className={styles.divider}>|</span>

                <span>{timeAgo(post.postDate)}</span>

                <span className={styles.divider}>|</span>

                <span className={styles.like_count}>
                  <FavoriteIcon className={styles.heart_icon} />
                  {post.likeCount}
                </span>
                <span className={styles.divider}>|</span>

                <span>조회수: {post.viewCount}</span>
              </div>
            </li>
          ) : (
            <li
              key={`my-post-${post.rn}`}
              className={styles.comm_card}
              onClick={async () => {
                try {
                  await axios.patch(
                    `${import.meta.env.VITE_BACKSERVER}/communities/view/${post.communityNo}`,
                    post,
                  );
                } catch (e) {
                  console.error(e);
                }
                navigate(`/community/view/${post.communityNo}`);
              }}
            >
              <h3 className={styles.comm_item_title}>
                {post.rn}. [커뮤니티] {post.communityTitle}
              </h3>

              <div className={styles.comm_meta_box}>
                <span className={styles.writer}>작성자: {memberId}</span>
                <span className={styles.divider}>|</span>

                <span>{timeAgo(post.postDate)}</span>

                <span className={styles.divider}>|</span>

                <span className={styles.like_count}>
                  <FavoriteIcon className={styles.heart_icon} />
                  {post.likeCount}
                </span>
                <span className={styles.divider}>|</span>

                <span>조회수: {post.viewCount}</span>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  );
};

export default MypageMain;
