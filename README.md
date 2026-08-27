## 2일차 실습 (Weather Composition) 주요 내용

`WeatherMockup.vue`에 반응형 상태 관리/computed/watch를 추가한 커밋. 헷갈릴 수 있는 부분 정리.

- **`selectedCityInfo`는 문자열이 아니라 도시 객체 전체**: 1일차의 `selectedCity`는 도시 이름(문자열)만 저장했지만, 2일차부터는 `selectCity(city)`가 도시 객체를 통째로 저장함. 상태바 문구에는 `selectedCityInfo.name`처럼 꺼내 써야 함.
- **검색어가 비어 있을 때 전체 목록이 보이는 이유**: `filteredWeatherList`는 `city.name.includes(searchQuery)`로 필터링하는데, 빈 문자열은 모든 문자열에 포함(`includes('')`는 항상 `true`)되므로 별도 분기 없이 "검색어 없으면 전체 출력"이 자동으로 충족됨.
- **`watch` vs `watchEffect` 사용 구분**: `selectedCityInfo`는 `watch`로 명시적으로 감시(상태바 문구가 바뀔 때만 반응), `searchQuery`는 `watchEffect`로 감시(콜백 내부에서 참조하는 반응형 값을 자동 추적). 두 API를 의도적으로 다르게 써서 차이를 보여주는 실습 포인트.
- **`sortedWeatherList`는 `filteredWeatherList` 위에 정렬을 얹은 것**: 화면(`v-for`)에 실제로 쓰이는 건 `sortedWeatherList`. 검색 필터링(`filteredWeatherList`) → 정렬(`sortOrder` 기준) 순서로 계산되는 파생 상태 체인이라, `weatherList` 원본을 직접 참조하는 곳은 `filteredWeatherList` 내부뿐임.
- **`sortOrder`/`toggleSortOrder`/`sortedWeatherList`는 과제 요구사항에 없는 자율 추가 항목** (요구사항 5번: 본인만의 반응형 상태/Computed/Watcher).

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
