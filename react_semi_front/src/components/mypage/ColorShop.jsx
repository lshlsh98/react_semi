import { useEffect, useState } from "react";
import styles from "./ColorShop.module.css";
import axios from "axios";
import useAuthStore from "../utils/useAuthStore";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const ColorShop = () => {
  const { memberId } = useAuthStore();
  const [colorList, setColorList] = useState([]);
  const [selectColor, setSelectColor] = useState(null);

  const [memberColor, setMemberColor] = useState({
    memberId: memberId,
    colorId: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/mypages/color`)
      .then((res) => {
        console.log(res.data);
        setColorList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const purchaseColor = () => {
    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/mypages/color`, memberColor)
      .then((res) => {
        useAuthStore.getState().setHexCode(selectColor);
        navigate("/member/mypage");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={styles.member_info_wrap}>
      <h3 className="page-title">닉네임 색상 상점</h3>
      <div className={styles.color_preview}>
        <span className={styles.label}>미리보기</span>
        <h1 style={{ color: selectColor }}>{memberId}</h1>
      </div>
      <ColorList
        colorList={colorList}
        setSelectColor={setSelectColor}
        setMemberColor={setMemberColor}
      />
      <div className={styles.return_wrap}>
        <div
          className={styles.color_div_select}
          style={{
            backgroundColor: selectColor,
          }}
        ></div>
        <form
          className={styles.button_wrap}
          onSubmit={(e) => {
            e.preventDefault();
            purchaseColor();
          }}
          autoComplete="off"
        >
          <Button type="submit" className="btn primary lg">
            구매하기
          </Button>
        </form>
      </div>
    </section>
  );
};

const ColorList = ({
  colorList,
  selectColorId,
  setMemberColor,
  setSelectColor,
}) => {
  return (
    <div className={styles.color_button_list}>
      {colorList.map((color) => {
        return (
          <div
            key={`color-${color.colorId}`}
            className={`${styles.color_div} ${selectColorId === color.colorId ? styles.selected : ""}`}
            style={{
              backgroundColor: color.hexCode,
            }}
            onClick={() => {
              setMemberColor((prev) => ({
                ...prev,
                colorId: color.colorId,
              }));
              setSelectColor(color.hexCode);
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default ColorShop;
