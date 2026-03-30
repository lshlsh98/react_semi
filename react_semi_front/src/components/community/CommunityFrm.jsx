import styles from "./CommunityFrm.module.css";

const CommunityFrm = ([
  community,
  inputCommunity,
  files,
  addFiles,
  deleteFile,
  inputCommunityContent,
  addDeleteFileList,
]) => {
  console.log(files);
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
    </div>
  );
};

export default CommunityFrm;
