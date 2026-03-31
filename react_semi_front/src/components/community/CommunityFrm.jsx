import { Input, TextArea } from "../ui/Form";
import styles from "./Community.module.css";
const CommunityFrm = ({ community, inputCommunity }) => {
  return (
    <div className={styles.community_frm_wrap}>
      <div className={styles.input_wrap}>
        <label htmlFor="communityTitle">제목</label>
        <Input
          type="text"
          name="communityTitle"
          id="communityTitle"
          value={community.communityTitle}
          onChange={inputCommunity}
        />
      </div>
      <div className={styles.input_wrap}>
        <label htmlFor="files">첨부파일</label>
        <label htmlFor="files" className={styles.file_btn}>
          파일추가
        </label>
        <input type="file" id="files"></input>
        <input type="submit" value="test"></input>
      </div>
      <div className={styles.input_wrap}>
        <label htmlFor="communityContent">내용</label>
        <TextArea
          name="communityContent"
          id="communityContent"
          value={community.communityContent}
          onChange={inputCommunity}
        ></TextArea>
      </div>
    </div>
  );
};

export default CommunityFrm;
