import { useEffect, useState } from "react";
import styles from "./TradeStatus.module.css";

const TradeStatus = () => {
  const [chartData, setChartData] = useState([]);
  const [listData, setListData] = useState([]);

  const [complete, setComplete] = useState(0); // 0: 전체 / 1: 완료 / 2: 미완료

  useEffect(() => {}, []);

  return (
    <div className={styles.trade_status_wrap}>
      <h3 className="page-title">거래 현황</h3>
      <section className={styles.chart_filter_section}></section>
      <section className={styles.chart_section}></section>
      <section className={styles.list_filter_section}></section>
      <section className={styles.list_section}>
        <ul className={`${styles.trade_item} ${styles.title_ul}`}>
          <li className={styles.trade_no}>거래 번호</li>
          <li className={styles.trade_title}>거래 제목</li>
          <li className={styles.trade_addr}>거래 장소</li>
          <li className={styles.trade_price}>거래 금액</li>
          <li className={styles.trade_completed}>완료 여부</li>
          <li className={styles.trade_completed_date}>완료된 날짜</li>
        </ul>
        {listData.map((list) => (
          <ul className={styles.trade_item}>
            <li className={styles.trade_no}>{list.market_no}</li>
            <li className={styles.trade_title}>{list.market_title}</li>
            <li className={styles.trade_addr}>{list.sell_addr}</li>
            <li className={styles.trade_price}>{list.sell_price}</li>
            <li className={styles.trade_completed}>{list.completed}</li>
            <li className={styles.trade_completed_date}>
              {list.completed_date}
            </li>
          </ul>
        ))}
      </section>
    </div>
  );
};

export default TradeStatus;
