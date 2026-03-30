import { useNavigate } from "react-router-dom";
import useAuthStore from "../../components/utils/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";

const MarketListPage = () => {
  const navigate = useNavigate();
  const { memberId } = useAuthStore();
  const [marketList, setMarketList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(0);

  /* 사이즈 셋팅 */
  const [totalPage, setTotalPage] = useState(null);

  const [order, setOrder] = useState(0);
  /* 정렬관리 스테이트 */

  /* 페이지네이션 사용시 전달할 매개변수 page,setPage,totalPage,naviSize */
  const [keyword, setKeyword] = useState(""); /* 화면표현용 스테이트 */
  const [searchKeyword, setSearchKeyword] =
    useState(""); /* 서버전송용 스테이트 */

  const [loaction, setLocation] = useState(0);
  /* 카테고리 관리 스테이트 */

  useEffect(() => {
    axios
      .get()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <hr />
      <p>안녕</p>
    </>
  );
};
export default MarketListPage;
