import { EditorContent, useEditor } from "@tiptap/react";
import styles from "./TextEditor.module.css";
import StarterKit from "@tiptap/starter-kit";

const TextEditor = ({ data, setData }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: data || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setData(editor.getHTML());
    },
  });
  return (
    <div className={styles.editor_wrap}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className={styles.editor_content} />
    </div>
  );
};

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }
  return (
    <>
      <div className={styles.menu_bar}>
        <button
          type="button"
          className={
            editor.isActive("heading", { level: 1 }) ? styles.active : ""
          }
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
        >
          H1
        </button>

        <button
          type="button"
          className={
            editor.isActive("heading", { level: 2 }) ? styles.active : ""
          }
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          H2
        </button>

        <button
          type="button"
          className={editor.isActive("bulletList") ? styles.active : ""}
          onClick={() => {
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          리스트
        </button>
      </div>
    </>
  );
};

export default TextEditor;
