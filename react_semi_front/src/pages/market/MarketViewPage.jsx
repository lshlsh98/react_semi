import styles from "./MarketViewPage.module.css";
import Button from "../../components/ui/Button";
import useAuthStore from "../../components/utils/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'; 
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReportIcon from '@mui/icons-material/Report';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';



const MarketViewPage = () => {
  const { memberId,isReady } = useAuthStore();
  //console.log(memberId);

  const params = useParams();
  const marketNo = params.marketNo;
  //console.log("게시글번호 : " + marketNo);

  const [market, setMarket] = useState(null);
  const imgUrl = "http://192.168.31.24:9999/market";

  console.log("isReady 확인용 : ",isReady);

  useEffect(() => {
    if(!isReady){
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}`)
      .then((res) => {
        console.log(res.data);
        setMarket(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [memberId, marketNo,isReady]);

  const ImageClick = (filePath) => {
    const popup = window.open(
      "",
      "_blank",
      "width=1440,height=1024,scrollbars=yes,resizable=yes",
    );

    popup.document.write(`
      <html>
        <head>
          <title>이미지 보기</title>
          <style>
            body { margin:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f0f0f0; }
            img { max-width:100%; max-height:100%; }
            button { margin-top:20px; padding:8px 20px; font-size:16px; cursor:pointer; border-radius: 6px; background-color : #549849; color: #ffffff; border:1px solid #549849 }
          </style>
        </head>
        <body>
          <img src="${filePath}" alt="큰 이미지" />
          <button onclick="window.close()">닫기</button>
        </body>
      </html>
    `);

    popup.document.close();
  };
  return (
    <main className={styles.main_wrap}>
      {market && (
        <>
          <div className={styles.photo_wrap}>
            <ImageList
              sx={{ width: 720, height: 360 }}
              cols={3}
              rowHeight={164}
            >
              {market.fileList.map((file, index) => (
                <ImageListItem key={index}>
                  <img
                    src={`${imgUrl}/${file.marketFilePath}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${imgUrl}/${file.marketFilePath}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt="상품 이미지"
                    loading="lazy"
                    title="클릭시 큰이미지로 볼 수 있어요"
                    onClick={() =>
                      ImageClick(`${imgUrl}/${file.marketFilePath}`)
                    }
                    style={{ cursor: "pointer" }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </div>
          <div className={styles.photo_wrap}>사진</div>
          <div className={styles.title_wrap}>
            <div className={styles.title_info}>
              <p className={styles.title_info_title}>{market.marketTitle}</p>
              <p className={styles.title_info_price}>
                {market.sellPrice.toLocaleString("ko-KR")}원
              </p>
              <div className={styles.date_view_like}>
                <p>{market.marketDate.slice(0, 10)}</p>
                <p>조회수 : {market.viewCount}</p>
                <p>좋아요</p>
              </div>
              <LikeAndReport marketNo={marketNo} /> 
            </div>
            <div className={styles.title_map}>지도가 들어갈 예정</div>
            {memberId && memberId !== market.marketWriter &&(
              <div className={styles.title_btn}>
                <Button className="btn primary">거래하기</Button>
                <Button
                  className="btn primary"
                  style={{
                    backgroundColor: "pink",
                    border: "1px solid pink",
                  }}
                >
                  좋아요
                </Button>
                <Button className="btn primary danger">신고하기</Button>
              </div>
            )}
          </div>

          <div className={styles.content_wrap}>본문</div>
          {memberId && memberId === market.marketWriter && (
            <div className={styles.button_wrap}>
              <Button className="btn primary">수정</Button>
              <Button className="btn primary danger">삭제</Button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

const LikeAndReport = ({marketNo})=>{
  const[likeInfo,setLikeInfo] = useState(null);
  console.log("글번호 확인용 : ",marketNo)
  
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKSERVER}/markets/${marketNo}/likes`)
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })
  },[])
  return(<> 
  
  {likeInfo &&(<> <ThumbUpAltIcon sx={{fill:"var(--primary)"}} />
  <span style={{color:"var(--primary)"}}>10</span></>)}
  
  <ReportGmailerrorredIcon sx={{fill:"var(--danger)"}}/>
  <span style={{color:"var(--danger)"}}>3</span>
  </>)
}

export default MarketViewPage;
