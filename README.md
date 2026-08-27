# ⛳ 골프장 웨더

전국 골프장의 실시간 날씨 · 일몰/티오프 시각을 보여주는 Vue 3 실습 프로젝트입니다.
아래는 일차별 실습 기록입니다.

---

## 📋 실습별 주요 내용

### 🧩 2일차 · Weather Composition

- `selectedCityInfo`: 문자열 대신 도시 객체 전체를 저장
- `selectedCityInfo`는 `watch`, `searchQuery`는 `watchEffect`로 구분해서 감시
- 정렬 기능(`sortOrder`/`sortedWeatherList`)은 자율 추가 항목 (요구사항 5번)

### 🧭 2일차 · Weather Router

- Mock 데이터를 `src/mocks/weatherMockData.js`로 공유, 모든 라우트는 `import()`로 Lazy Loading + `/:pathMatch(.*)*` catch-all 적용
- `WeatherDetailView`는 `onMounted`에서만 도시 조회 (상세→상세 직접 이동 시 안 바뀌는 한계 있지만 지금 구조에선 무관)
- 자율 추가 view(요구사항 6번)는 통계 요약 페이지 대신 쿼리스트링(`?a=&b=`) 기반 도시 비교 페이지로 선택 — 상세 페이지가 이미 다루는 경로 파라미터와 다른 방식(쿼리 파라미터)을 연습해보고 싶어서

### 🎛️ 3일차 · Weather Store

- `stores/configStore.js`: `state.unit`(초기값 `celsius`) / `getters.unitSymbol` / `actions.toggleUnit`으로 온도 단위 관리
- `WeatherCard`/`WeatherDetailView`는 각자 `displayTemp` computed로 `configStore.unit`에 맞춰 변환 표시 (온도 구간 분류는 원본 섭씨 기준 그대로 유지)
- 자율 추가(요구사항 4번)는 새 Store 대신 `configStore`에 `windUnit`/`toggleWindUnit` 확장 — 상세 페이지 풍속(m/s ↔ mph) 토글에 적용

### 🌐 3일차 · Weather Axios

- 앱 컨셉을 "국내 도시 날씨"에서 "**골프장 날씨**"로 전환 — `cityList.js`를 실제 골프장 6곳(스카이72, 레이크사이드CC, 아시아드CC, 대전CC, 무등산CC, 오라CC)의 좌표로 교체, Home/Detail/Compare/About 문구도 전부 골프장 기준으로 수정
- `weatherMockData.js` 삭제, `cityList.js`(좌표만 있는 정적 목록) + `weatherStore`(Pinia)로 교체 — Home/Detail/Compare가 실시간 데이터를 공유
- OpenWeatherMap 추가 API(요구사항 2번)는 5일 예보(Forecast) 엔드포인트를 붙여서 상세 페이지에 표시
- 기타 외부 API(요구사항 3번)는 환율 → Giphy(짤) 순으로 시도했다가 둘 다 골프장 컨셉과 안 맞아서 제거하고, 최종적으로 **일몰 API(sunrise-sunset.org)**로 "마지막 티오프 권장 시각"(일몰 1시간 전)을 계산해서 상세 페이지에 표시
- API 키(OpenWeatherMap)는 프로젝트 루트 `.env.local`(`VITE_OPENWEATHER_API_KEY`)에 저장, `import.meta.env`로 읽음 (`.gitignore`의 `*.local` 규칙 덕분에 커밋 안 됨). 일몰 API는 키가 필요 없음
- 배포 이후 자율적으로 **미세먼지(Air Pollution) API**도 추가 — 기존 OpenWeatherMap 키를 그대로 재사용해서 새 가입 없이 확장
  - PM2.5 농도로 환경부 기준 등급(좋음/보통/나쁨/매우나쁨)을 직접 계산해서 OpenWeatherMap 자체 AQI 지수와 같이 표시
  - PM2.5 35㎍/m³ 초과 시 마스크 착용 권장 문구 표시
  - Home 배너에 "대기질 양호 골프장 수" 통계 추가, Compare 페이지 비교 표에 PM2.5 행 추가

### 🎨 3일차 · Weather UI Library

- `element-plus` 설치 + 전역 등록(`main.js`), `--el-color-primary` 등 CSS 변수를 골프장 그린 톤으로 오버라이드
- `el-input`/`el-card`/`el-tag`/`el-button`/`el-select`/`el-table`/`el-menu`/`el-alert`/`el-skeleton`로 직접 짠 CSS 상당수를 대체
- UI를 골프장 테마(그린 그라데이션 히어로, 실제 골프장 사진, 온도별 컬러 카드)로 전면 리디자인 — 기능/상태 로직은 그대로 유지

---

## 🐛 Troubleshooting

### 📅 1일차

<details open>
<summary><strong>😵 화면이 창 너비를 다 못 쓰고 좁게 표시됨</strong></summary>

- 🔍 **증상**: 브라우저 창을 넓혀도 페이지 콘텐츠가 화면 일부(창 폭의 1/4 정도)에만 좁게 표시되고 나머지는 빈 배경으로 남음.
- 🧩 **원인**: `src/assets/main.css`에 Vite/Vue 기본 스캐폴드가 남겨둔 `#app` 규칙이 원인이었음.
  - `#app { max-width: 1280px; margin: 0 auto; }`로 폭이 고정됨
  - `@media (min-width: 1024px)`에서 `#app { display: grid; grid-template-columns: 1fr 1fr; }`로 2단 그리드가 적용되어, 화면이 넓어질수록 콘텐츠가 그리드의 절반 칸에만 들어감
- 🛠️ **해결**: `main.css`에서 `#app`의 `max-width`, `margin`, 2단 그리드(`display: grid; grid-template-columns: 1fr 1fr;`) 규칙을 제거. 레이아웃 폭 제어는 각 컴포넌트(예: `WeatherMockup.vue`의 `.app`)에서 직접 하도록 함.

</details>

### 📅 2일차

<details open>
<summary><strong>🔀 정렬 버튼을 누르면 검색 필터 결과 순서가 계속 꼬일 뻔함</strong></summary>

- 🔍 **증상**: 정렬 토글 버튼(`sortOrder`)을 눌렀다 검색어를 지웠다 하는 걸 반복하면, 전체 목록의 원래 순서(`weatherList`)가 서서히 뒤섞여서 검색어가 없을 때도 처음 데이터 순서와 달라질 수 있는 구조였음.
- 🧩 **원인**: `Array.prototype.sort()`는 새 배열을 만들지 않고 **원본 배열을 그 자리에서 변형(in-place)**하는 메서드임. `sortedWeatherList` computed에서 `filteredWeatherList.value`를 복사하지 않고 바로 `.sort()`했다면, `filteredWeatherList`(나아가 그 원본인 `weatherList`)의 배열 자체가 정렬된 상태로 영구히 바뀌어버림.
- 🛠️ **해결**: `[...filteredWeatherList.value].sort(...)`처럼 스프레드로 복사본을 만든 뒤 정렬해서, 원본 `weatherList` 순서는 그대로 보존하고 화면에 쓰이는 `sortedWeatherList`만 매번 새로 계산되도록 함.

</details>

<details open>
<summary><strong>🔗 상세 페이지끼리 바로 이동하면 도시 정보가 안 바뀔 수 있음</strong></summary>

- 🔍 **증상**: `WeatherDetailView`(`/weather/:cityId`)에서 다른 도시의 상세 페이지로 곧장 이동하는 링크를 만든다면(예: 도시 A 상세 → 도시 B 상세), 화면이 갱신되지 않고 이전 도시 정보가 그대로 남아있을 수 있는 구조였음.
- 🧩 **원인**: Vue Router는 같은 라우트 컴포넌트(`WeatherDetailView`)로 매칭되는 경로를 이동할 때 컴포넌트를 언마운트/재마운트하지 않고 `params`만 바꿔서 재사용함. 그런데 도시 조회 로직을 `onMounted`(마운트 시 1회)에만 넣어두면, `cityId` params가 바뀌어도 그 로직이 다시 실행되지 않음.
- 🛠️ **해결**: 지금 구조에서는 상세 페이지로 항상 홈(`WeatherHomeView`)에서만 진입하고 상세 페이지끼리는 서로 링크하지 않아서 실제로는 문제가 되지 않음(요구사항 문구 그대로 `onMounted`로 구현). 다만 나중에 상세 페이지끼리 바로 이동하는 기능을 추가한다면 `onMounted` 대신 `watch(() => route.params.cityId, ...)`로 바꿔야 함.

</details>

### 📅 3일차

<details open>
<summary><strong>🌡️ 화씨로 바꾸면 온도 배지가 다 틀어질 뻔함</strong></summary>

- 🔍 **증상**: 만약 카드의 온도 구간 분류(추움/선선함/따뜻함/더움)에 단위 변환된 표시값을 그대로 썼다면, 화씨로 전환하는 순간 배지가 전부 "더움"으로 나오는 등 분류가 뒤죽박죽됐을 것.
- 🧩 **원인**: 분류 기준(18/25/30)은 섭씨 기준 숫자인데, 화씨로 변환된 값(예: 32°C → 90°F)을 그 기준과 그대로 비교하면 임계값 자체가 안 맞음.
- 🛠️ **해결**: `tempClass`는 원본 `city.temp`(섭씨)를 그대로 기준으로 쓰고, `displayTemp`(단위 변환값)는 화면에 보여주는 용도로만 분리해서 씀.

</details>

<details open>
<summary><strong>☔ 카드의 강수확률 배지를 실제 API로는 그대로 못 살렸음</strong></summary>

- 🔍 **증상**: mock 데이터 시절 카드에 있던 "강수확률/강수량" 배지를 실제 API 응답에 그대로 연결하려고 하면 해당 값이 없어서 `undefined%`로 나왔을 것.
- 🧩 **원인**: OpenWeatherMap의 "현재 날씨(Current Weather)" 엔드포인트는 강수확률(`pop`) 필드를 제공하지 않음. `pop`은 5일 예보(Forecast) 엔드포인트의 3시간 단위 항목에만 들어있음.
- 🛠️ **해결**: 카드의 강수확률 배지를 제거하고, 실제로 존재하는 데이터(기온/습도/풍속/날씨 상태 아이콘)만 표시하도록 바꿈.

</details>

<details open>
<summary><strong>📦 Element Plus를 통째로 등록해서 번들 용량이 크게 늘어남</strong></summary>

- 🔍 **증상**: 빌드하면 메인 청크가 약 946KB로, Vite가 "500KB 넘는 청크가 있다"는 경고를 띄움.
- 🧩 **원인**: `app.use(ElementPlus)`로 라이브러리 전체를 한 번에 전역 등록해서, 실제로 쓰는 컴포넌트보다 훨씬 많은 컴포넌트가 번들에 다 포함됨.
- 🛠️ **해결**: 지금은 실습 규모라 그대로 둠. 나중에 최적화하려면 `unplugin-vue-components` 같은 자동 임포트 플러그인으로 실제 쓰는 컴포넌트만 등록하도록 바꿔야 함.

</details>

---

## 📝 느낀 점

### 🐣 1일차

목업 이미지랑 똑같이 만들어보려고 시작했는데, 처음엔 화면 배경이 계속 까맣게 나와서 한참 헤맸다. 알고 보니 다크모드 CSS랑 Vite 기본 템플릿에 남아있던 레이아웃 제약 때문이었는데, 원인 찾고 나니 허무했다. VS Code에 파일이 열려있는 상태에서 코드가 계속 예전 버전으로 돌아가는 것도 처음엔 이해가 안 갔는데, 편집기 버퍼랑 디스크 파일이 따로 노는 거였다. 그래도 v-for/v-if 카드 뿌리기, 클릭 이벤트, 버블링 방지까지 하나씩 붙여나가니 목업이랑 비슷한 모양이 나와서 뿌듯했다.

### 🌱 2일차

반응형 상태를 `searchQuery`/`selectedCityInfo`처럼 이름 붙여 다시 정리하고, computed·watch·watchEffect를 실제로 구분해서 써보니 각자 언제 쓰는 게 맞는지 감이 좀 잡혔다. 컴포넌트 4개로 쪼개는 작업은 생각보다 손이 많이 갔는데, slot으로 넘긴 자식 컴포넌트가 사실 부모 스코프에서 컴파일된다는 걸 직접 코드로 보니까 이해가 훨씬 잘 됐다. 라우터까지 붙이면서는 지연 로딩된 청크가 빌드 결과물에 실제로 쪼개져 나오는 걸 보고 신기했고, `sort()`가 원본 배열을 건드린다거나 `onMounted`가 파라미터 변경엔 반응 안 한다는 것처럼 알고 있던 걸 직접 코드에서 마주치니 더 오래 기억에 남을 것 같다.

### 🌳 3일차

Pinia store까지 붙이면서는 여러 컴포넌트(카드, 상세 페이지)가 같은 상태를 공유해서 쓰는 느낌을 처음 제대로 체감했는데, 표시용 변환값이랑 분류 기준값을 같은 걸로 착각하면 바로 버그로 이어진다는 걸 배지 분류 로직 짜면서 새삼 느꼈다. 실제 외부 API를 붙여보니 mock 데이터엔 당연히 있던 필드(강수확률 등)가 실제 응답엔 없어서 당황했는데, API 문서를 직접 뒤져보면서 어떤 엔드포인트가 무슨 데이터를 주는지 구분해서 쓰는 연습이 됐다. 수업에서 "외부 API 쓸 때 확인할 것 5가지(요청 URL/방식/파라미터/API 키/응답 형식)"로 정리해주신 게, 막연하게 "API 붙인다"고만 생각했던 걸 실제로 코드 짤 때 뭘 채워야 하는지 체크리스트처럼 쓸 수 있게 해줘서 도움이 됐다. 실제 키 발급받아서 처음 화면에 진짜 날씨가 뜨는 걸 보니 mock 데이터로 만들 때보다 훨씬 실감 났다. 요구사항 3번(기타 외부 API) 하나 정하는데 환율 → Giphy 짤 → 일몰까지 세 번을 갈아엎었는데, 돌아보니 "국내 도시 날씨"라는 원래 컨셉 자체가 애매해서 뭘 붙여도 억지스러웠던 거였고, 아예 "골프장 날씨"로 대상을 좁히고 나니 일몰(마지막 티오프 시각)이 자연스럽게 나왔다. 기능부터 붙이기 전에 "이 앱이 정확히 누구를 위한 건가"부터 정하는 게 먼저라는 걸 느꼈다. UI 라이브러리를 붙이고 나니 버튼·셀렉트·테이블을 하나하나 직접 스타일링하던 시간이 확 줄었는데, 대신 라이브러리 내부 구조(`:deep()`로 뚫어야 하는 부분들)를 파악하는 데 시간이 좀 들었다. 디자인을 골프장 테마로 갈아엎으면서는 `--el-color-primary` 색상 변수 하나만 바꿔도 버튼·태그·메뉴가 전부 같이 바뀌는 걸 보고, 디자인 시스템/CSS 변수를 쓰는 이유를 몸으로 느꼈다.
