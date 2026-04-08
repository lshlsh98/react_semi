import { useNavigate } from "react-router-dom";
import styles from "./CommunityList.module.css";

const CommunityList = ({ communityList }) => {
  return (
    <ul className={styles.community_list_wrap}>
      {communityList.map((community) => {
        return (
          <CommunityItem
            key={`community-list-${community.communityNo}`}
            community={community}
          />
        );
      })}
    </ul>
  );
};

const CommunityItem = ({ community }) => {
  const navigate = useNavigate();

  return (
    <li
      className={
        community.memberGrade === 3
          ? styles.community_item
          : styles.community_item_manager
      }
    >
      <div className={styles.community_writer_view_wrap}>
        <div className={styles.community_writer}>
          <div
            className={
              community.memberThumb
                ? styles.member_thumb_exists
                : styles.member_thumb
            }
          >
            {community.memberThumb ? (
              <img
                src={`${import.meta.env.VITE_BACKSERVER}/semi/${community.memberThumb}`}
              ></img>
            ) : (
              <span className="material-icons">account_circle</span>
            )}
          </div>
          <p>
            {community.communityWriter +
              (community.memberGrade === 3 ? "" : " (관리자)")}
          </p>
        </div>
        <div className={styles.community_view_count}>
          <span className="material-icons">visibility</span>
          <p>{community.viewCount}</p>
        </div>
      </div>
      <div
        className={styles.community_content_wrap}
        onClick={() => {
          navigate(`/community/view/${community.communityNo}`);
        }}
      >
        <p className={styles.community_title}>
          {community.memberGrade === 3
            ? community.communityTitle
            : "[공지] " + community.communityTitle}
        </p>
        <ConvertContent communityContent={community.communityContent} />
      </div>
      <div className={styles.community_info_wrap}>
        <div className={styles.community_info_item_wrap}>
          <div
            className={
              community.likeCount === 0
                ? styles.community_info_like_wrap
                : styles.community_info_like_wrap_on
            }
          >
            <span className="material-icons">thumb_up_off_alt</span>
            <p>{community.likeCount}</p>
          </div>
          <div
            className={
              community.dislikeCount === 0
                ? styles.community_info_dislike_wrap
                : styles.community_info_dislike_wrap_on
            }
          >
            <span className="material-icons">thumb_down_off_alt</span>
            <p>{community.dislikeCount}</p>
          </div>
          <div
            className={
              community.reportCount === 0
                ? styles.community_info_report_wrap
                : styles.community_info_report_wrap_on
            }
          >
            <span className="material-icons">report_gmailerrorred</span>
            <p>{community.reportCount}</p>
          </div>
        </div>
        <div className={styles.community_date_wrap}>
          <p>{community.communityDate}</p>
        </div>
      </div>
    </li>
  );
};

const ConvertContent = ({ communityContent }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(communityContent, "text/html");
  const text = doc.body.textContent || "";
  return <div className={styles.community_content}>{text}</div>;
};

export default CommunityList;
