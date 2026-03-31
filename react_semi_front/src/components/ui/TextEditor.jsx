import { EditorContent, useEditor } from "@tiptap/react";
import styles from "./TextEditor.module.css";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ResizeImage from "tiptap-extension-resize-image";

const TextEditor = ({ data, setData }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, ResizeImage],
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
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) {
        return;
      }
      const form = new FormData();
      form.append("image", file);
    };
  };
  return (
    <div className={styles.menu_bar}>
      <button type="button" onClick={addImage}>
        Image
      </button>

      <button
        type="button"
        className={editor.isActive("bold") ? styles.active : ""}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        Bold
      </button>

      <button
        type="button"
        className={editor.isActive("italic") ? styles.active : ""}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        Italic
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
    </div>
  );
};
export default TextEditor;
