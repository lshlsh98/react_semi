import styles from "./MyBoardList.module.css";
import AdminBoardItem from "./AdminBoardItem";
import { useState } from "react";

const AdminBoardList = () => {
  return (
    <div className={styles.myboard_list_wrap}>
      <AdminBoardItem />
      <AdminBoardItem />
      <AdminBoardItem />
      <AdminBoardItem />
      <AdminBoardItem />
      <AdminBoardItem />
      <AdminBoardItem />
      <AdminBoardItem />
      <AdminBoardItem />
      <AdminBoardItem />
    </div>
  );
};

export default AdminBoardList;
