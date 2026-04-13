import { useEffect, useState } from "react";
import styles from "./CarbonContribution.module.css";
import axios from "axios";
import useAuthStore from "../utils/useAuthStore";
import Pagination from "../ui/Pagination";
import BasicSelect from "../ui/BasicSelect";

const CarbonContribution = () => {
  const { memberId } = useAuthStore();
  const [memberScore, setMemberScore] = useState(0);

  const [page, setPage] = useState(0); // 시작 숫자
  const [size, setSize] = useState(10); // 페이징 개수
  const [totalPage, setTotalPage] = useState(null);
  const [order, setOrder] = useState(1); // 정렬 조건
  const [view, setView] = useState(1); //출력 조건

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {
        setMemberScore(res.data.memberScore);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/carbon-contribution/${memberId}?page=${page}&size=${size}&order=${order}&view=${view}`,
      )
      .then((res) => {
        setMemberScore(res.data.memberScore);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/carbon-contribution/${memberId}?page=${page}&size=${size}&order=${order}&view=${view}`,
      )
      .then((res) => {
        setMemberScore(res.data.memberScore);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, order, view]);

  return (
    <section className={styles.carbon_contribution_wrap}>
      <h3 className="page-title">나의 탄소 기여도</h3>
      <div className={styles.carbon_contribution}>
        <p>{memberScore}P</p>
      </div>

      <div className={styles.carbon_contribution_list_wrap}>
        <div className={styles.carbon_contribution_order_wrap}>
          <BasicSelect
            state={view}
            setState={setView}
            onChange={(e) => {
              setPage(0);
            }}
            list={[
              [0, "전체"],
              [1, "획득"],
              [2, "소모"],
            ]}
          />
          <BasicSelect
            state={order}
            setState={setOrder}
            onChange={(e) => {
              setPage(0);
            }}
            list={[
              [1, "최신순"],
              [2, "과거순"],
            ]}
          />
        </div>
        <ul className={styles.carbon_contribution_list_title}>
          <li className={styles.carbon_contribution_status}>상태</li>
          <li className={styles.carbon_contribution_market_title}>거래명</li>
          <li className={styles.carbon_contribution_changed_score}>
            기여도 획득량
          </li>
          <li className={styles.carbon_contribution_score_date}>거래일</li>
        </ul>
        <div className={styles.member_list_pagination}>
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

const CarbonContributionList = ({ carbonContributionList }) => {
  return (
    <ul className={styles.carbon_contribution_list_wrap}>
      {carbonContributionList.map((carbonContribution) => {
        return (
          <CarbonContributionItem
            key={`carbonContribution-list-${carbonContribution.scoreNo}`}
            carbonContribution={carbonContribution}
          />
        );
      })}
    </ul>
  );
};

const CarbonContributionItem = ({ carbonContribution }) => {
  return (
    <ul>
      <li>{carbonContribution.historyStatus === 1 ? "적립" : "소모"}</li>
      <li>{carbonContribution.marketTitle}</li>
      <li>
        {carbonContribution.historyStatus === 1
          ? "+" + carbonContribution.changedScore
          : "-" + carbonContribution.changedScore}
        P
      </li>
      <li>{carbonContribution.scoreDate}</li>
    </ul>
  );
};

export default CarbonContribution;
