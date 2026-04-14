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

const MypageMain = () => {
  const { memberId } = useAuthStore();
  const [data, setData] = useState([]);
  const [memberScore, setMemberScore] = useState(0);

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
  }, []);

  return (
    <section className={styles.member_info_wrap}>
      <h3 className="page-title">활동 기록</h3>
      <CarbonContributionView memberScore={memberScore} />
      <ChartComponent data={data} />
    </section>
  );
};

const CarbonContributionView = ({ memberScore }) => {
  return (
    <div className={styles.carbon_contribution_wrap}>
      <p>나의 탄소 기여도</p>
      <div className={styles.carbon_contribution}>
        <p>{memberScore}P</p>
      </div>
    </div>
  );
};

const ChartComponent = ({ data }) => {
  return (
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
  );
};

export default MypageMain;
