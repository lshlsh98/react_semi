import { Input, TextArea } from "../ui/Form";
import styles from "./Community.module.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ClearIcon from "@mui/icons-material/Clear";
import TextEditor from "../ui/TextEditor";
const CommunityFrm = ({
  community,
  inputCommunity,
  files,
  addFiles,
  deleteFile,
  inputCommunityContent,
  addDeleteFileList,
}) => {
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

      <div className={styles.input_wrap}>
        <label htmlFor="communityContent">내용</label>
        <TextEditor
          data={community.communityContent}
          setData={inputCommunityContent}
        ></TextEditor>
      </div>
      <div className={styles.input_wrap}>
        <input
          type="file"
          id="files"
          onChange={(e) => {
            const fileList = Array.from(e.target.files);
            addFiles(fileList);
          }}
          multiple
          style={{ display: "none" }}
        ></input>

        <div className={styles.file_wrap}>
          {community.fileList &&
            community.fileList.map((file, index) => {
              return (
                <FileItem
                  key={"old-file-item-" + index}
                  file={file}
                  deleteFile={addDeleteFileList}
                ></FileItem>
              );
            })}
          {files.map((file, index) => {
            return (
              <FileItem
                key={"file-item-" + index}
                file={file}
                deleteFile={deleteFile}
              ></FileItem>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FileItem = ({ file, deleteFile }) => {
  return (
    <ul className={styles.file_item}>
      <li>
        <InsertDriveFileIcon />
      </li>
      <li className={styles.file_name}>
        {file.name || file.communityFileName}
      </li>
      <li>
        <ClearIcon
          className={styles.file_delete}
          onClick={() => {
            deleteFile(file);
          }}
        />
      </li>
    </ul>
  );
};

export default CommunityFrm;
