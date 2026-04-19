import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../components/utils/useAuthStore";
import styles from "./MarketWritePage.module.css";
import axios from "axios";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import { useKakaoPostcode } from "@clroot/react-kakao-postcode";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import ClearIcon from "@mui/icons-material/Clear";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

const MarketModifyPage = () => {
  const { memberId, memberAddr } = useAuthStore();
  const navigate = useNavigate();
  const params = useParams();
  const marketNo = params.marketNo;
  const [market, setMarket] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}`)
      .then((res) => {
        if (res.data.success) {
          setMarket({ ...res.data.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [marketNo]);

  /* 파일 관리용 스테이트 */
  const [files, setFiles] = useState([]);
  /* 파일 추가 함수 */
  const addFiles = (fileList) => {
    const imageFiles = fileList.filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length !== fileList.length) {
      Swal.fire({
        icon: "warning",
        title: "이미지 파일만 업로드 가능합니다.",
      });
    }
    /* 최대 이미지 개수 설정 */
    if (files.length + imageFiles.length > 10) {
      Swal.fire({
        icon: "warning",
        title: "이미지는 최대 10장까지 업로드 가능합니다.",
      });
      return;
    }
    const newFiles = [...files, ...imageFiles];
    setFiles(newFiles);
  };

  /* 파일 삭제용 함수*/
  const deleteFile = (file) => {
    const newFiles = files.filter((item) => {
      return item !== file;
    });
    setFiles(newFiles);
  };

  /* 기존파일 삭제용 함수 */
  const [deleteFileList, setDeleteFileList] = useState([]);
  const addDeleteFileList = (file) => {
    //화면에서 기존파일을 없애는 작업 - market.fileList를 변환
    const newFileList = market.fileList.filter((item) => {
      return item !== file;
    });
    setMarket({ ...market, fileList: newFileList });
    setDeleteFileList([...deleteFileList, file.marketFilePath]); //지워야할 마켓 파일 전달
    //
  };
  /* INPUT 함수 */
  const inputMarket = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newMarket = { ...market, [name]: value };
    setMarket(newMarket);
  };

  /* 판매 제목 함수 */
  const inputMarketTitle = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (value.length > 50) {
      Swal.fire({
        icon: "warning",
        title: "50자 이상 쓸 수 없어요.",
      });
      return;
    }
    setMarket({ ...market, [name]: value });
  };

  /* 판매 금액 함수 */
  const inputMarketPrice = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const onlyNumber = value.replace(/[^0-9]/g, "");

    if (onlyNumber === "") {
      setMarket({ ...market, [name]: "" });
      return;
    }

    const num = Number(onlyNumber);

    if (num < 0) {
      Swal.fire({
        icon: "warning",
        title: "0원 보다 작게 설정하실 수는 없어요!",
      });
      return;
    }

    if (num > 10000000) {
      Swal.fire({
        icon: "warning",
        title: "최대 1,000만원까지 설정 가능해요!",
      });
      return;
    }

    setMarket({
      ...market,
      [name]: num,
    });
  };
  /* 테스트 에디터용 함수 */

  const inputMarketContent = (data) => {
    setMarket({ ...market, marketContent: data });
  };

  /* 판매 주소*/
  const detailRef = useRef(null);

  const { open } = useKakaoPostcode({
    onComplete: (data) => {
      //console.log(data);

      setMarket({
        ...market,
        marketPostcode: data.zonecode,
        sellAddr: data.roadAddress,
      });
      detailRef.current.focus();
    },
  });

  /* 수정하기버튼 클릭이벤트 연결 함수 */
  const modify = () => {
    if (
      market.marketTitle === "" ||
      market.marketContent === "" ||
      market.sellPrice === "" ||
      market.sellAddr === "" ||
      (files.length === 0 && (!market.fileList || market.fileList.length === 0))
    ) {
      Swal.fire({
        icon: "warning",
        title: "빠짐없이 작성해주세요.",
      });
      return;
    }
    //console.log("수정하기 버튼클릭");
    const form = new FormData();
    form.append("marketTitle", market.marketTitle);
    form.append("marketContent", market.marketContent);
    form.append("sellPrice", market.sellPrice);
    form.append("sellAddr", market.sellAddr);
    form.append("marketWriter", memberId);
    files.forEach((file) => {
      form.append("files", file);
    });
    deleteFileList.forEach((marketFilePath) => {
      form.append("deleteFilePath", marketFilePath);
    });

    for (let pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    axios
      .put(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          const { newFileCount, deleteFileCount } = res.data.data;

          Swal.fire({
            title: "게시물 수정완료",
            html: `
          게시글 수정 성공<br/>
          새로운 파일 수 : ${newFileCount} 개<br/>
          삭제한 파일 수 : ${deleteFileCount} 개
        `,
            icon: "success",
            confirmButtonText: "닫기",
            confirmButtonColor: "pink",
          }).then(() => {
            navigate(`/market/view/${marketNo}`);
          });
        } else {
          // 🔥 서버에서 실패 응답 (권한없음, DB 실패 등)
          Swal.fire({
            title: "수정 실패",
            text: res.data.message,
            icon: "error",
            confirmButtonText: "확인",
          }).then(() => {
            navigate(`/market/view/${marketNo}`);
          });
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "오류발생,콘솔확인",
          icon: "error",
        });
      });
  };

  return (
    <section className={styles.market_write_wrap}>
      <h3 className={styles.page_title}>마켓 게시글 수정</h3>
      {/* 제목 필드 */}
      <div className={styles.market_input_wrap}>
        <label htmlFor="marketTitle">제목</label>
        <Input
          type="text"
          name="marketTitle"
          id="marketTitle"
          value={market.marketTitle}
          onChange={inputMarketTitle}
        ></Input>
      </div>
      {/* 금액 필드 */}
      <div className={styles.market_input_wrap}>
        <label htmlFor="sellPrice">판매금액(원)</label>
        <Input
          type="text"
          name="sellPrice"
          id="sellPrice"
          value={market.sellPrice}
          onChange={inputMarketPrice}
          placeholder="숫자만 입력 가능"
        ></Input>
      </div>

      {/* 거래 장소 필드 */}
      <div className={styles.market_input_wrap}>
        <label htmlFor="marketTitle">거래장소</label>
        {/* <input
          type="text"
          name="sellAddr"
          id="sellAddr"
          value={market.sellAddr}
          onChange={inputMarket}
        ></input> */}

        <div className={styles.market_addr}>
          <Input
            style={{ backgroundColor: "var(--light)" }}
            type="text"
            name="sellAddr"
            id="sellAddr"
            value={market.sellAddr}
            onChange={inputMarket}
            readOnly={true}
          ></Input>

          <Button type="button" className="btn primary" onClick={open}>
            주소 찾기
          </Button>
          <Input
            style={{ display: "none" }}
            type="text"
            name="sellAddrDetail"
            onChange={inputMarket}
            ref={detailRef}
          />
        </div>
      </div>
      {/* MAP API 영역 */}
      <div className={styles.market_input_wrap}>
        <label>API 등록 예정</label>
      </div>

      {/* 내용 필드 */}
      <div>
        <TextEditor data={market.marketContent} setData={inputMarketContent} />
      </div>

      {/* 파일첨부 필드 */}
      <div className={styles.market_file_wrap}>
        <label
          htmlFor="files"
          className={styles.file_btn}
          title="이미지는 최대 10장까지 저장됩니다."
        >
          파일추가
        </label>
        <input
          type="file"
          id="files"
          multiple
          accept="image/*" /* 1차로 업로드파일 이미지로 제한 */
          style={{ display: "none" }}
          onChange={(e) => {
            //e.target.files -> 선택한 파일들을 FileList 객체로 반환 (배열로 유사하지만 배열은 아님)
            //배열로 변환해서 사용
            const fileList = Array.from(e.target.files);
            //console.log(fileList);

            addFiles(fileList);
          }}
        ></input>
        <div className={styles.file_wrap}>
          {market.fileList &&
            market.fileList.map((file, index) => {
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

      <div className={styles.market_write_btn_wrap}>
        <Button className="btn primary" onClick={modify}>
          수정하기
        </Button>

        <Button
          className="btn primary danger"
          onClick={() => {
            Swal.fire({
              title: "작성을 취소하시겠어요?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "네",
              cancelButtonText: "아니오",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate(`/market/view/${marketNo}`);
              }
            });
          }}
        >
          작성취소
        </Button>
      </div>
    </section>
  );
};

const FileItem = ({ file, deleteFile }) => {
  return (
    <ul className={styles.file_item}>
      <li>
        <InsertPhotoIcon />
      </li>
      {/*file.name || file.marketFileName 수정할때 파일이름 출력*/}
      <li className={styles.file_name}>{file.name || file.marketFileName}</li>
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

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className={styles.menu_bar}>
      {/* H1 */}
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 1 }) ? styles.active : ""
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="글자 H1 적용"
      >
        <LooksOneIcon />
      </button>

      {/* H2 */}
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 2 }) ? styles.active : ""
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="글자 H2 적용"
      >
        <LooksTwoIcon />
      </button>

      {/* Bold */}
      <button
        type="button"
        className={editor.isActive("bold") ? styles.active : ""}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="글자 진하게"
      >
        <FormatBoldIcon />
      </button>

      {/* Italic */}
      <button
        type="button"
        className={editor.isActive("italic") ? styles.active : ""}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="글자 기울이기"
      >
        <FormatItalicIcon />
      </button>

      {/* 리스트 */}
      <button
        type="button"
        className={editor.isActive("bulletList") ? styles.active : ""}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="글자 목록 적용"
      >
        <FormatListBulletedIcon />
      </button>

      {/* 정렬 */}
      <button
        type="button"
        className={editor.isActive({ textAlign: "left" }) ? styles.active : ""}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        title="문단 왼쪽 정렬"
      >
        <FormatAlignLeftIcon />
      </button>

      <button
        type="button"
        className={
          editor.isActive({ textAlign: "center" }) ? styles.active : ""
        }
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        title="문단 가온데 정렬"
      >
        <FormatAlignCenterIcon />
      </button>

      <button
        type="button"
        className={editor.isActive({ textAlign: "right" }) ? styles.active : ""}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        title="문단 오른쪽 정렬"
      >
        <FormatAlignRightIcon />
      </button>

      {/* 색상 */}
      <input
        type="color"
        className={styles.color_picker}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        title="색상적용"
      />

      {/* 되돌리기 */}
      <button
        type="button"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
        title="작업 되돌리기"
      >
        <UndoIcon />
      </button>

      {/* 다시하기 */}
      <button
        type="button"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        title="작업 다시하기"
      >
        <RedoIcon />
      </button>

      {/* 삭제 */}
      <button
        style={{ backgroundColor: "var(--danger)" }}
        type="button"
        disabled={editor.isEmpty}
        onClick={() => {
          Swal.fire({
            title: "내용을 모두 삭제하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
          }).then((result) => {
            if (result.isConfirmed) {
              editor.chain().focus().clearContent().run();
            }
          });
        }}
        title="지우기"
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

const TextEditor = ({ data, setData }) => {
  //console.log(data);

  let lastValidHTML = "";
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: data,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setData(html);
    },

    /* 에디터의 글자수를 제한 */
    editorProps: {
      handleTextInput(view, from, to, text) {
        const currentHTML = view.dom.innerHTML;
        const newHTML = currentHTML + text;
        const byteLength = new TextEncoder().encode(newHTML).length;
        //console.log("새글자입력" + byteLength);
        if (byteLength > 4000) {
          alert("최대입력수 초과");
          return true; // 입력 막기
        }
        return false;
      },

      handleKeyDown(view, event) {
        if (event.key === "Enter") {
          const html = view.dom.innerHTML;
          const byteLength = new TextEncoder().encode(html).length;
          console.log(byteLength);
          if (byteLength > 4000) {
            alert("더이상 입력할수 없어요");
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const byteLength = new TextEncoder().encode(html).length;

      if (byteLength > 4000) {
        editor.commands.setContent(lastValidHTML, false);
        console.log(byteLength);
        alert("지워버린다.");
        return;
      }
      lastValidHTML = html;
      setData(html);
    },
  });
  useEffect(() => {
    if (editor && data) {
      editor.commands.setContent(data);
    }
  }, [data, editor]);

  return (
    <div className={styles.editor_wrap}>
      <MenuBar editor={editor} className={styles.menu_bar} />
      <EditorContent editor={editor} className={styles.editor_content} />
    </div>
  );
};

export default MarketModifyPage;
