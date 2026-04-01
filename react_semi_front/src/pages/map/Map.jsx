import { useEffect, useRef, useState } from "react";
import styles from "./Map.module.css";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import { useKakaoPostcode } from "@clroot/react-kakao-postcode";
import axios from "axios";

const Map = () => {
  const mapDivRef = useRef(null); // 화면의 지도 ref (div에 연결됨)
  const markersRef = useRef([]); // 화면의 마커 ref

  const [mapObj, setMapObj] = useState(null); // 네이버 지도 객체 자체를 저장 (나중에 지도 중심 이동할 때 씀)
  const [infoWindowObj, setInfoWindowObj] = useState(null); // marker 클릭시 나오는 정보창 객체를 저장
  const [searchAddr, setSearchAddr] = useState(""); // 인풋창에 보여질 주소 텍스트

  // 가짜 유저 정보 (테스트용)
  const mockUser = {
    isLoggedIn: false,
    address: "서울특별시 마포구 월드컵북로 434",
  };

  // 맨 처음 한번만 실행되며 첫 화면 세팅
  useEffect(() => {
    if (!mapDivRef.current || !window.naver) return; // div에 연결된 지도가 없거나 뭐지 네이버 api를 못 불러오면 return

    // 정보창 세팅
    const infoWindow = new window.naver.maps.InfoWindow({
      content: "",
      backgroundColor: "var(--gray8)",
      borderWidth: 1,
      borderColor: "var(--secendary)",
      anchorSize: new window.naver.maps.Size(10, 10),
    });
    setInfoWindowObj(infoWindow);

    const center = new window.naver.maps.LatLng(37.554648, 126.972559); // 서울역을 중심으로
    const map = new window.naver.maps.Map(mapDivRef.current, {
      center: center,
      zoom: 15,
    });
    setMapObj(map);

    window.naver.maps.Event.addListener(map, "click", () => {
      infoWindow.close();
    });

    // 💡 2. 지도가 그려졌으니, 이제 유저 상태를 확인합니다.
    if (mockUser.isLoggedIn && mockUser.address) {
      // 로그인 유저: 주소를 좌표로 변환해서 '이동(panTo)' 시킵니다.
      window.naver.maps.Service.geocode(
        { query: mockUser.address },
        (status, response) => {
          if (
            status === window.naver.maps.Service.Status.OK &&
            response.v2.addresses.length > 0
          ) {
            const { x, y, addressElements } = response.v2.addresses[0];
            const sidoEl = addressElements.find((el) =>
              el.types.includes("SIDO"),
            );
            const regionName = sidoEl ? sidoEl.shortName : "서울";

            // 🌟 아까 만든 지도의 중심을 유저 동네로 스르륵 이동시킴!
            const newPoint = new window.naver.maps.LatLng(y, x);
            map.panTo(newPoint);

            // 해당 동네 데이터 불러오기
            fetchGreenReturnData(map, infoWindow, regionName);
          }
        },
      );
    } else {
      // 비로그인 유저: 이미 서울역 지도가 떠 있으니, 서울 데이터만 불러오면 끝!
      fetchGreenReturnData(map, infoWindow, "서울");
    }
  }, []);

  // =========================================================================
  // 🟢 STEP 2: 공공데이터 서버에서 거점 정보 가져오기
  // =========================================================================
  const fetchGreenReturnData = (
    currentMap,
    sharedInfoWindow,
    regionName = "",
  ) => {
    const params = {
      pageNo: 1,
      numOfRows: 630, // 데이터가 가장 많은 서울이 630개임(기준을 서울로)
      returnType: "json",
    };

    if (regionName) {
      params.positnRgnNm = regionName;
    }

    axios
      .get(
        `/api/B552584/kecoapi/rtrvlCmpnPositnService/getCmpnPositnInfo?serviceKey=${encodeURIComponent(import.meta.env.VITE_GREEN_RETURN_API_KEY)}`,
        { params },
      )
      .then((res) => {
        console.log(res.data);
        markersRef.current.forEach((marker) => marker.setMap(null)); // 이건 마커 지우는 작업
        markersRef.current = [];

        const dataList = res.data.body?.items || [];

        // 새로운 마커 함수
        const newMarkers = dataList.map((item) => {
          const position = new window.naver.maps.LatLng(
            parseFloat(item.positnPstnLat),
            parseFloat(item.positnPstnLot),
          );

          const marker = new window.naver.maps.Marker({
            position: position,
            map: currentMap,
          });

          // 마커 클릭 이벤트
          window.naver.maps.Event.addListener(marker, "click", () => {
            const content = `
              <div style="padding: 15px; min-width: 200px; line-height: 1.5;">
                <h4 style="margin: 0 0 8px 0; color: var(--secendary);">그린리턴 거점</h4>
                <p style="margin: 0; font-size: 13px; font-weight: bold;">${item.positnRdnmAddr}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: var(--gray4);">${item.positnIntdcCn || "상세정보 없음"}</p>
              </div>
            `;

            const isOpen =
              sharedInfoWindow.getMap() &&
              sharedInfoWindow.getPosition().equals(marker.getPosition());

            if (isOpen) {
              sharedInfoWindow.close();
            } else {
              sharedInfoWindow.setContent(content);
              sharedInfoWindow.open(currentMap, marker);
            }
          });

          return marker;
        });

        markersRef.current = newMarkers;
      })
      .catch((err) => {
        console.log("데이터 로딩 실패:", err);
      });
  };

  // =========================================================================
  // 🟢 STEP 3: 카카오 주소 검색 & 지도 이동
  // =========================================================================
  const { open } = useKakaoPostcode({
    onComplete: (data) => {
      setSearchAddr(data.roadAddress);
      const regionName = data.sido; // '시/도' 단위 추출(이걸로 그린리턴 찍히는 범위를 '시/도' 기준으로 찍을거임)

      if (window.naver && window.naver.maps.Service) {
        window.naver.maps.Service.geocode(
          { query: data.roadAddress },
          (status, response) => {
            if (
              status === window.naver.maps.Service.Status.OK &&
              response.v2.addresses.length > 0
            ) {
              const { x, y } = response.v2.addresses[0];
              const newPoint = new window.naver.maps.LatLng(y, x);

              mapObj.panTo(newPoint);
              mapObj.setZoom(12);

              if (infoWindowObj) infoWindowObj.close();

              // 🌟 이동한 지역의 데이터 불러오기!
              fetchGreenReturnData(mapObj, infoWindowObj, regionName);
            } else {
              alert("해당 주소를 지도에서 찾을 수 없습니다.");
            }
          },
        );
      }
    },
  });

  // =========================================================================
  // 🟢 STEP 4: 화면 디자인 (팀장님의 UI 컴포넌트 200% 활용!)
  // =========================================================================
  return (
    <div className={styles.map_wrap}>
      <h3 className={styles.page_title}>그린리턴 맵</h3>

      <div className={styles.search_area}>
        {/* 💡 .input_box로 너비만 제한하고, 디자인은 <Input>에게 온전히 맡깁니다. */}
        <div className={styles.input_box}>
          <Input
            type="text"
            value={searchAddr}
            readOnly
            placeholder="주소를 검색하세요"
          />
        </div>

        {/* 💡 팀장님이 만드신 'btn'과 'primary' 클래스를 조합해서 넣었습니다! */}
        <Button className="btn primary" onClick={open}>
          주소 검색
        </Button>
      </div>

      <div className={styles.map_div} ref={mapDivRef}></div>
    </div>
  );
};

export default Map;
