## 2일차 실습 (Weather Composition) 주요 내용

- `selectedCityInfo`: 문자열 대신 도시 객체 전체를 저장
- `selectedCityInfo`는 `watch`, `searchQuery`는 `watchEffect`로 구분해서 감시
- 정렬 기능(`sortOrder`/`sortedWeatherList`)은 자율 추가 항목 (요구사항 5번)

## 2일차 실습 (Weather Router) 주요 내용

- Mock 데이터를 `src/mocks/weatherMockData.js`로 공유, 모든 라우트는 `import()`로 Lazy Loading + `/:pathMatch(.*)*` catch-all 적용
- `WeatherDetailView`는 `onMounted`에서만 도시 조회 (상세→상세 직접 이동 시 안 바뀌는 한계 있지만 지금 구조에선 무관)
- 자율 추가 view(요구사항 6번)는 통계 요약 페이지 대신 쿼리스트링(`?a=&b=`) 기반 도시 비교 페이지로 선택 — 상세 페이지가 이미 다루는 경로 파라미터와 다른 방식(쿼리 파라미터)을 연습해보고 싶어서

## 3일차 실습 (Weather Store) 주요 내용

- `stores/configStore.js`: `state.unit`(초기값 `celsius`) / `getters.unitSymbol` / `actions.toggleUnit`으로 온도 단위 관리
- `WeatherCard`/`WeatherDetailView`는 각자 `displayTemp` computed로 `configStore.unit`에 맞춰 변환 표시 (온도 구간 분류는 원본 섭씨 기준 그대로 유지)
- 자율 추가(요구사항 4번)는 새 Store 대신 `configStore`에 `windUnit`/`toggleWindUnit` 확장 — 상세 페이지 풍속(m/s ↔ mph) 토글에 적용

## Troubleshooting

### 1일차

#### 화면이 창 너비를 다 못 쓰고 좁게 표시됨

- **증상**: 브라우저 창을 넓혀도 페이지 콘텐츠가 화면 일부(창 폭의 1/4 정도)에만 좁게 표시되고 나머지는 빈 배경으로 남음.
- **원인**: `src/assets/main.css`에 Vite/Vue 기본 스캐폴드가 남겨둔 `#app` 규칙이 원인이었음.
  - `#app { max-width: 1280px; margin: 0 auto; }`로 폭이 고정됨
  - `@media (min-width: 1024px)`에서 `#app { display: grid; grid-template-columns: 1fr 1fr; }`로 2단 그리드가 적용되어, 화면이 넓어질수록 콘텐츠가 그리드의 절반 칸에만 들어감
- **해결**: `main.css`에서 `#app`의 `max-width`, `margin`, 2단 그리드(`display: grid; grid-template-columns: 1fr 1fr;`) 규칙을 제거. 레이아웃 폭 제어는 각 컴포넌트(예: `WeatherMockup.vue`의 `.app`)에서 직접 하도록 함.

### 2일차

#### 정렬 버튼을 누르면 검색 필터 결과 순서가 계속 꼬일 뻔함

- **증상**: 정렬 토글 버튼(`sortOrder`)을 눌렀다 검색어를 지웠다 하는 걸 반복하면, 전체 목록의 원래 순서(`weatherList`)가 서서히 뒤섞여서 검색어가 없을 때도 처음 데이터 순서와 달라질 수 있는 구조였음.
- **원인**: `Array.prototype.sort()`는 새 배열을 만들지 않고 **원본 배열을 그 자리에서 변형(in-place)**하는 메서드임. `sortedWeatherList` computed에서 `filteredWeatherList.value`를 복사하지 않고 바로 `.sort()`했다면, `filteredWeatherList`(나아가 그 원본인 `weatherList`)의 배열 자체가 정렬된 상태로 영구히 바뀌어버림.
- **해결**: `[...filteredWeatherList.value].sort(...)`처럼 스프레드로 복사본을 만든 뒤 정렬해서, 원본 `weatherList` 순서는 그대로 보존하고 화면에 쓰이는 `sortedWeatherList`만 매번 새로 계산되도록 함.

#### 상세 페이지끼리 바로 이동하면 도시 정보가 안 바뀔 수 있음

- **증상**: `WeatherDetailView`(`/weather/:cityId`)에서 다른 도시의 상세 페이지로 곧장 이동하는 링크를 만든다면(예: 도시 A 상세 → 도시 B 상세), 화면이 갱신되지 않고 이전 도시 정보가 그대로 남아있을 수 있는 구조였음.
- **원인**: Vue Router는 같은 라우트 컴포넌트(`WeatherDetailView`)로 매칭되는 경로를 이동할 때 컴포넌트를 언마운트/재마운트하지 않고 `params`만 바꿔서 재사용함. 그런데 도시 조회 로직을 `onMounted`(마운트 시 1회)에만 넣어두면, `cityId` params가 바뀌어도 그 로직이 다시 실행되지 않음.
- **해결**: 지금 구조에서는 상세 페이지로 항상 홈(`WeatherHomeView`)에서만 진입하고 상세 페이지끼리는 서로 링크하지 않아서 실제로는 문제가 되지 않음(요구사항 문구 그대로 `onMounted`로 구현). 다만 나중에 상세 페이지끼리 바로 이동하는 기능을 추가한다면 `onMounted` 대신 `watch(() => route.params.cityId, ...)`로 바꿔야 함.

### 3일차

#### 화씨로 바꾸면 온도 배지가 다 틀어질 뻔함

- **증상**: 만약 카드의 온도 구간 분류(추움/선선함/따뜻함/더움)에 단위 변환된 표시값을 그대로 썼다면, 화씨로 전환하는 순간 배지가 전부 "더움"으로 나오는 등 분류가 뒤죽박죽됐을 것.
- **원인**: 분류 기준(18/25/30)은 섭씨 기준 숫자인데, 화씨로 변환된 값(예: 32°C → 90°F)을 그 기준과 그대로 비교하면 임계값 자체가 안 맞음.
- **해결**: `tempClass`는 원본 `city.temp`(섭씨)를 그대로 기준으로 쓰고, `displayTemp`(단위 변환값)는 화면에 보여주는 용도로만 분리해서 씀.

## 느낀 점

### 1일차

목업 이미지랑 똑같이 만들어보려고 시작했는데, 처음엔 화면 배경이 계속 까맣게 나와서 한참 헤맸다. 알고 보니 다크모드 CSS랑 Vite 기본 템플릿에 남아있던 레이아웃 제약 때문이었는데, 원인 찾고 나니 허무했다. VS Code에 파일이 열려있는 상태에서 코드가 계속 예전 버전으로 돌아가는 것도 처음엔 이해가 안 갔는데, 편집기 버퍼랑 디스크 파일이 따로 노는 거였다. 그래도 v-for/v-if 카드 뿌리기, 클릭 이벤트, 버블링 방지까지 하나씩 붙여나가니 목업이랑 비슷한 모양이 나와서 뿌듯했다.

### 2일차

반응형 상태를 `searchQuery`/`selectedCityInfo`처럼 이름 붙여 다시 정리하고, computed·watch·watchEffect를 실제로 구분해서 써보니 각자 언제 쓰는 게 맞는지 감이 좀 잡혔다. 컴포넌트 4개로 쪼개는 작업은 생각보다 손이 많이 갔는데, slot으로 넘긴 자식 컴포넌트가 사실 부모 스코프에서 컴파일된다는 걸 직접 코드로 보니까 이해가 훨씬 잘 됐다. 라우터까지 붙이면서는 지연 로딩된 청크가 빌드 결과물에 실제로 쪼개져 나오는 걸 보고 신기했고, `sort()`가 원본 배열을 건드린다거나 `onMounted`가 파라미터 변경엔 반응 안 한다는 것처럼 알고 있던 걸 직접 코드에서 마주치니 더 오래 기억에 남을 것 같다.

### 3일차

Pinia store까지 붙이면서는 여러 컴포넌트(카드, 상세 페이지)가 같은 상태를 공유해서 쓰는 느낌을 처음 제대로 체감했는데, 표시용 변환값이랑 분류 기준값을 같은 걸로 착각하면 바로 버그로 이어진다는 걸 배지 분류 로직 짜면서 새삼 느꼈다.
