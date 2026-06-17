## 전체 구조

```
react_semi/
├── .env.example                    # 환경 변수 템플릿
├── docker-compose.yml              # Docker 배포 설정 (Backend + Frontend)
├── react_semi_back/                # Spring Boot 백엔드
└── react_semi_front/               # React 프론트엔드
```

---

## Backend 

**Spring Boot 4.0.3 · Java 17 · MyBatis · MySQL · WebSocket(STOMP)**

```
react_semi_back/
├── Dockerfile
├── pom.xml
└── src/main/
    ├── java/kr/co/iei/
    │   ├── ReactSemiBackApplication.java   # 애플리케이션 진입점
    │   ├── SpringSecurityConfig.java       # Spring Security + JWT 필터 설정, CORS 설정
    │   ├── WebConfig.java                  # MVC 추가 설정
    │   │
    │   ├── member/                         # 회원 도메인
    │   │   ├── controller/
    │   │   │   └── MemberController.java   # 로그인, 회원가입, 아이디/비밀번호 찾기 API
    │   │   └── model/
    │   │       ├── dao/MemberDao.java
    │   │       ├── service/MemberService.java
    │   │       └── vo/
    │   │           ├── Member.java
    │   │           ├── LoginMember.java
    │   │           ├── MemberListItem.java
    │   │           └── MemberListResponse.java
    │   │
    │   ├── market/                         # 중고거래 도메인
    │   │   ├── controller/
    │   │   │   └── MarketController.java   # 게시글 CRUD, 댓글, 신고, 거래 요청 API
    │   │   └── model/
    │   │       ├── dao/MarketDao.java
    │   │       ├── service/MarketService.java
    │   │       ├── dto/
    │   │       │   ├── MarketCreateResponse.java
    │   │       │   ├── MarketResponse.java
    │   │       │   └── MarketUpdateResponse.java
    │   │       └── vo/
    │   │           ├── Market.java
    │   │           ├── MarketFile.java
    │   │           ├── MarketComment.java
    │   │           ├── MarketCommentReport.java
    │   │           ├── MarketReport.java
    │   │           ├── TradeRequest.java
    │   │           ├── ScoreHistory.java
    │   │           ├── ListItem.java
    │   │           ├── ListResponse.java
    │   │           └── CommentListItem.java
    │   │
    │   ├── community/                      # 커뮤니티 게시판 도메인
    │   │   ├── controller/
    │   │   │   └── CommunityController.java # 게시글 CRUD, 댓글, 좋아요/싫어요, 신고 API
    │   │   └── model/
    │   │       ├── dao/CommunityDao.java
    │   │       ├── service/CommunityService.java
    │   │       └── vo/
    │   │           ├── Community.java
    │   │           ├── CommunityLike.java / CommunityDislike.java
    │   │           ├── CommunityComment.java
    │   │           ├── CommunityCommentLike.java / CommunityCommentDislike.java
    │   │           ├── CommunityCommentReport.java
    │   │           ├── CommunityReport.java
    │   │           ├── CommunityListItem.java
    │   │           ├── CommunityListResponse.java
    │   │           └── CommunityCommentListItem.java
    │   │
    │   ├── chat/                           # 실시간 채팅 도메인 (STOMP WebSocket)
    │   │   ├── config/
    │   │   │   ├── StompWebSocketConfig.java  # WebSocket 엔드포인트(/connect), 브로커 설정
    │   │   │   ├── StompHandler.java          # 연결 시 JWT 토큰 검증 인터셉터
    │   │   │   └── StompEventListener.java    # 연결/구독/해제 이벤트 처리
    │   │   ├── controller/
    │   │   │   ├── ChatController.java        # 채팅방 생성·조회 REST API
    │   │   │   └── StompController.java       # 메시지 발행 처리 (@MessageMapping)
    │   │   └── model/
    │   │       ├── dao/ChatDao.java
    │   │       ├── service/ChatService.java
    │   │       └── vo/
    │   │           ├── ChatRoom.java
    │   │           ├── ChatMessage.java
    │   │           ├── ChatMessageDto.java
    │   │           ├── ChatParticipant.java
    │   │           ├── ReadStatus.java
    │   │           ├── ChatRoomListResDto.java
    │   │           ├── MyChatListResDto.java
    │   │           ├── CreatePrivateRoomReqDto.java
    │   │           └── ChatRoomAndMemberReqDto.java
    │   │
    │   ├── mypage/                         # 마이페이지 도메인
    │   │   ├── controller/
    │   │   │   └── MypageController.java   # 내 게시글/댓글 조회·수정·삭제, 신고 관리, 색상 아이템, 탄소 기여도 API
    │   │   └── model/
    │   │       ├── dao/MypageDao.java
    │   │       ├── service/MypageService.java
    │   │       └── vo/
    │   │           ├── BoardSummary.java / MyPost.java
    │   │           ├── CommentSummary.java
    │   │           ├── BoardListRequestDto.java / BoardListResponseDto.java
    │   │           ├── CommentListResponseDto.java
    │   │           ├── TradeStatusReqDto.java / TradeStatusResDto.java
    │   │           ├── ReportRequestDto.java / ReportResponseDto.java
    │   │           ├── ChartResDto.java / TodayStats.java
    │   │           ├── Color.java / MemberColor.java
    │   │           ├── UpdateDto.java / UpdateCommentDto.java / CommentUpdateDto.java
    │   │           └── ColorShop 관련 VO
    │   │
    │   ├── common/
    │   │   └── exception/NotFoundException.java
    │   │
    │   └── utils/                          # 공통 유틸리티
    │       ├── JwtUtils.java               # JWT 토큰 생성·검증
    │       ├── JwtAuthFilter.java          # HTTP 요청마다 JWT 검증 필터
    │       ├── EmailSender.java            # Gmail SMTP 이메일 발송
    │       ├── FileUtils.java              # AWS S3 파일 업로드·삭제
    │       ├── S3Config.java               # AWS S3 클라이언트 Bean 설정
    │       └── CookieUtils.java            # 쿠키 유틸
    │
    └── resources/
        ├── application.properties          # DB, JWT, S3, Mail, 서버 포트 설정
        └── mapper/                         # MyBatis SQL XML
            ├── member-mapper.xml
            ├── market-mapper.xml
            ├── community-mapper.xml
            ├── chat-mapper.xml
            └── mypage-mapper.xml
```

---

## Frontend 

**React 19 · Vite 8 · React Router v7 · Zustand · Axios · MUI · TipTap · STOMP.js**

```
react_semi_front/
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                        # 애플리케이션 진입점 (BrowserRouter 설정)
    ├── App.jsx                         # 라우팅 정의, JWT 자동 만료 처리
    │
    ├── pages/                          # 페이지 단위 컴포넌트
    │   ├── main/
    │   │   └── MainPage.jsx            # 메인(랜딩) 페이지
    │   ├── member/
    │   │   ├── Join.jsx                # 회원가입 (주소 검색, 프로필 이미지 업로드)
    │   │   ├── Login.jsx               # 로그인
    │   │   ├── Find_id.jsx             # 아이디 찾기
    │   │   └── Find_pw.jsx             # 비밀번호 찾기 (이메일 인증)
    │   ├── community/
    │   │   ├── CommunityListPage.jsx   # 커뮤니티 목록
    │   │   ├── CommunityWritePage.jsx  # 게시글 작성 (TipTap 에디터)
    │   │   ├── CommunityViewPage.jsx   # 게시글 상세 (좋아요/싫어요, 댓글, 신고)
    │   │   └── CommunityModifyPage.jsx # 게시글 수정
    │   ├── market/
    │   │   ├── MarketListPage.jsx      # 중고거래 목록 (필터, 정렬, 지역)
    │   │   ├── MarketWritePage.jsx     # 상품 등록 (이미지 다중 업로드, 지도)
    │   │   ├── MarketViewPage.jsx      # 상품 상세 (거래 요청, 채팅 연결, 신고)
    │   │   ├── MarketModifyPage.jsx    # 상품 수정
    │   │   ├── MarketFrm.jsx           # 마켓 폼 공통 컴포넌트
    │   │   └── TextEditor.jsx          # 마켓 전용 텍스트 에디터
    │   ├── map/
    │   │   └── Map.jsx                 # 네이버 지도 기반 근처 거래 위치 탐색
    │   └── mypage/
    │       └── Mypage.jsx              # 마이페이지 레이아웃 및 중첩 라우팅
    │
    ├── components/                     # 재사용 컴포넌트
    │   ├── commons/
    │   │   ├── Header.jsx              # 전역 헤더 (로그인 상태, 닉네임 컬러)
    │   │   ├── Footer.jsx              # 전역 푸터
    │   │   └── Nickname.jsx            # 닉네임 + 등급 색상 표시 컴포넌트
    │   │
    │   ├── chat/
    │   │   ├── StompChatPage.jsx       # 채팅방 (STOMP WebSocket 실시간 메시지)
    │   │   └── MyChatPage.jsx          # 내 채팅방 목록
    │   │
    │   ├── community/
    │   │   ├── CommunityComment.jsx    # 댓글 목록 + 좋아요/싫어요/신고
    │   │   ├── CommunityFrm.jsx        # 커뮤니티 폼 공통
    │   │   └── CommunityList.jsx       # 커뮤니티 목록 아이템
    │   │
    │   ├── market/
    │   │   ├── MarketComment.jsx       # 중고거래 댓글 + 신고
    │   │   └── MarketMap.jsx           # 상품 위치 미니 지도
    │   │
    │   ├── mypage/
    │   │   ├── MypageMain.jsx          # 마이페이지 메인 (통계 차트, 오늘의 현황)
    │   │   ├── MemberInfo.jsx          # 회원 정보 조회·수정
    │   │   ├── MemberInfoManagement.jsx # 관리자 - 회원 상세 관리
    │   │   ├── MemberManagement.jsx    # 관리자 - 회원 목록 관리
    │   │   ├── MemberList.jsx          # 회원 목록 아이템
    │   │   ├── ChangePw.jsx            # 비밀번호 변경
    │   │   ├── ColorShop.jsx           # 닉네임 색상 아이템 구매
    │   │   ├── CarbonContribution.jsx  # 탄소 절감 기여도 차트
    │   │   ├── LikeDislike.jsx         # 좋아요/싫어요 현황
    │   │   ├── TradeStatus.jsx         # 거래 내역 조회
    │   │   ├── MyCommunityPage.jsx     # 내 커뮤니티 게시글 목록
    │   │   ├── MyCommunityCommentPage.jsx # 내 커뮤니티 댓글 목록
    │   │   ├── MyMarketPage.jsx        # 내 중고거래 게시글 목록
    │   │   ├── MyMarketCommentPage.jsx # 내 중고거래 댓글 목록
    │   │   ├── ReportModal.jsx         # 신고 처리 모달
    │   │   ├── PrivateReportModal.jsx  # 비공개 신고 모달
    │   │   └── board/
    │   │       ├── MyBoardItem.jsx / MyBoardList.jsx     # 내 커뮤니티 게시글 아이템/리스트
    │   │       ├── MyMarketItem.jsx / MyMarketList.jsx   # 내 마켓 게시글 아이템/리스트
    │   │       └── LikeDislikeList.jsx                  # 좋아요/싫어요 목록
    │   │   └── comment/
    │   │       └── MyCommentItem.jsx   # 내 댓글 아이템
    │   │
    │   ├── ui/                         # 공통 UI 컴포넌트
    │   │   ├── Button.jsx              # 공통 버튼
    │   │   ├── Form.jsx                # 공통 폼 래퍼
    │   │   ├── BasicSelect.jsx         # 셀렉트 박스
    │   │   ├── Pagination.jsx          # 페이지네이션
    │   │   ├── DateRangePicker.jsx     # 날짜 범위 선택기 (MUI X)
    │   │   └── TextEditor.jsx          # TipTap 기반 리치 텍스트 에디터
    │   │
    │   └── utils/
    │       └── useAuthStore.js         # Zustand 전역 인증 상태 (JWT, 회원 정보, localStorage 영속화)
    │
    └── assets/
        └── font/font.css               # 커스텀 폰트
```

