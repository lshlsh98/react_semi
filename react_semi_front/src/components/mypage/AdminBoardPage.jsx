import { useState } from "react";
import Pagination from "../ui/Pagination";
import styles from "./MyBoardPage.module.css";
import BasicSelect from "../ui/BasicSelect";
import AdminBoardList from "./board/AdminBoardList";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";

const AdminBoardPage = () => {
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(10);
  const [order, setOrder] = useState(0); // 0: 기본 1: 중급 2: 고급

  return (
    <div className={styles.myboard_wrap}>
      <div className={styles.filter_section}>
        <div className={styles.filter_input}>
          <Input />
          <SearchIcon />
        </div>
        <div className={styles.filter_select}>
          <BasicSelect
            state={order}
            setState={setOrder}
            list={[
              [0, "기본"],
              [1, "중급"],
              [2, "고급"],
            ]}
          />
          <BasicSelect
            state={order}
            setState={setOrder}
            list={[
              [0, "기본"],
              [1, "중급"],
              [2, "고급"],
            ]}
          />
        </div>
      </div>
      <div className={styles.myboard_list_content}>
        <AdminBoardList />
      </div>
      <div className={styles.pagination_section}>
        <Pagination
          totalPage={totalPage}
          page={page}
          setPage={setPage}
          naviSize={5}
        />
      </div>
    </div>
  );
};

export default AdminBoardPage;
