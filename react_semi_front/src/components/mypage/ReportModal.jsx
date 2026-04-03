import styles from "./ReportModal.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

const ReportModal = ({ board, tblName }) => {
  const obj = { boardNo: board.boardNo, tblName: tblName };
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/mypages/report/${board.boardNo}`,
        { params: obj },
      )
      .then((res) => {
        setReportList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.report_list_wrap}>
      <ul className={`${styles.report_item} ${styles.title_ul}`}>
        <li className={styles.report_writer}>신고자</li>
        <li className={styles.report_reason}>신고 사유</li>
      </ul>
      {reportList.map((report) => (
        <ul key={report.writerId} className={styles.report_item}>
          <li
            className={styles.report_writer}
          >{`${report.reportName} [${report.reportId}]`}</li>
          <li className={styles.report_reason}>{report.reportReason}</li>
        </ul>
      ))}
    </div>
  );
};

export default ReportModal;
