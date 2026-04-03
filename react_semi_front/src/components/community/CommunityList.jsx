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
    <li className={styles.community_item}>
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
              <span class="material-icons">account_circle</span>
            )}
          </div>
          <p>{community.communityWriter}</p>
        </div>
        <diiv className={styles.community_view_count}>
          <span class="material-icons">visibility</span>
          <p>{community.viewCount}</p>
        </diiv>
      </div>
      <div
        className={styles.community_content_wrap}
        onClick={() => {
          navigate(`/communities/view/${community.communityNo}`);
        }}
      >
        <p className={styles.community_title}>{community.communityTitle}</p>
        <p>{community.communityContent}</p>
      </div>
      <div className={styles.community_info_wrap}>
        <div className={styles.community_info_item_wrap}>
          <span class="material-icons">thumb_up_off_alt</span>
          <p>{community.likeCount}</p>
          <span class="material-icons">thumb_down_off_alt</span>
          <p>{community.dislikeCount}</p>
          <span class="material-icons">report_gmailerrorred</span>
          <p>{community.reportCount}</p>
        </div>
        <div className={styles.community_date_wrap}>
          <p>{community.communityDate}</p>
        </div>
      </div>
    </li>
  );
};

export default CommunityList;
