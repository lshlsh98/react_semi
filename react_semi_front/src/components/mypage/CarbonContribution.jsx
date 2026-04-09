import { Input } from "../ui/Form";
import styles from "./CarbonContribution.module.css";

const CarbonContribution = () => {
  return (
    <section className={styles.carbon_contribution_wrap}>
      <h3 className="page-title">나의 탄소 기여도</h3>
      <div className={styles.carbon_contribution}>
        <p>1600P</p>
      </div>
      <div className={styles.carbon_contribution_list_wrap}>
        <ul className={styles.carbon_contribution_list_title}>
          <li className={styles.m}>거래 목록</li>
          <li className={styles.m}>상태</li>
          <li className={styles.m}>기여도 획득량</li>
          <li className={styles.m}>거래일</li>
        </ul>
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
      <li>{carbonContribution.marketTitle}</li>
      <li> +100P </li>
      <li>{carbonContribution.marketCompletedDate}</li>
    </ul>
  );
};

export default CarbonContribution;
