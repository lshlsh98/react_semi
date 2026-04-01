import { useEffect, useRef, useState } from "react";
import styles from "./Map.module.css";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { useKakaoPostcode } from "@clroot/react-kakao-postcode";

const Map = () => {
  const mapDivRef = useRef(null); // 지도를 그릴 Ref

  // 지도 객체와 마커 객체를 상태(state)로 관리합니다.
  // (검색 후 지도를 이동시키거나 마커를 움직이려면 객체를 기억해야 합니다)
  const [mapObj, setMapObj] = useState(null);
  const [markerObj, setMarkerObj] = useState(null);

  // 검색된 주소를 보여줄 상태
  const [searchAddr, setSearchAddr] = useState("");

  // 1️⃣ 최초 화면 렌더링 시 지도 생성 (수업 코드 패턴)
  useEffect(() => {
    // 네이버 지도 스크립트가 로드되지 않았거나, div가 없으면 멈춤
    if (!mapDivRef.current || !window.naver) return;

    // 초기 중심 좌표 (예: 서울시청)
    const initialCenter = new window.naver.maps.LatLng(37.5666805, 126.9784147);

    // 지도 객체 생성
    const map = new window.naver.maps.Map(mapDivRef.current, {
      center: initialCenter,
      zoom: 15,
    });

    // 마커 객체 생성
    const marker = new window.naver.maps.Marker({
      position: initialCenter,
      map: map,
    });

    // 나중에 쓸 수 있도록 state에 저장해 둡니다.
    setMapObj(map);
    setMarkerObj(marker);
  }, []);

  // 2️⃣ 카카오 우편번호 API 연동 (팀장님 Address 수업 코드 활용)
  const { open } = useKakaoPostcode({
    onComplete: (data) => {
      // 검색 완료 시 실행되는 함수
      // 도로명 주소를 화면의 input 창에 보여주기 위해 저장합니다.
      setSearchAddr(data.roadAddress);

      // 💡 3️⃣ 핵심! 검색된 주소(도로명)를 네이버 지도의 위도/경도로 변환합니다.
      if (window.naver && window.naver.maps.Service) {
        window.naver.maps.Service.geocode(
          { query: data.roadAddress }, // 변환할 주소
          (status, response) => {
            if (status === window.naver.maps.Service.Status.ERROR) {
              return alert("주소를 좌표로 변환하는 데 실패했습니다.");
            }

            // 검색 결과가 있는 경우
            if (response.v2.meta.totalCount > 0) {
              const item = response.v2.addresses[0];
              // 찾은 주소의 x(경도), y(위도) 좌표로 LatLng 객체를 만듭니다.
              const point = new window.naver.maps.LatLng(item.y, item.x);

              // 아까 저장해둔 mapObj와 markerObj를 사용해 지도 이동 및 마커 위치 변경
              if (mapObj && markerObj) {
                mapObj.setCenter(point); // 지도 중심 이동
                markerObj.setPosition(point); // 마커 위치 이동
              }
            }
          },
        );
      }
    },
  });

  return (
    <div className={styles.map_wrap}>
      <h3 className="page-title">그린리턴 맵</h3>

      <div className={styles.search_area}>
        <Input
          type="text"
          placeholder="도로명 주소"
          value={searchAddr}
          readOnly
        />
        <Button className="btn primary" onClick={open}>
          주소 찾기
        </Button>
      </div>

      {/* mapDivRef로 지도 그리기 */}
      <div className={styles.map_div} ref={mapDivRef}></div>
    </div>
  );
};

export default Map;
