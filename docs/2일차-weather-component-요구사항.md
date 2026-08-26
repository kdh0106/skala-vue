# Hands on - Weather Component (2일차)

기능 변경 없이 4개의 Component 파일로 분리한다.

## 1. WeatherParent.vue

- 모든 반응형 데이터 유지

## 2. BaseDashboardCard.vue

- 검색박스와 리스트박스의 디자인을 공통화
- `<slot>`을 배치하여 부모 컴포넌트가 도시 검색 / 날씨 현황을 주입

## 3. SearchBar.vue

- 부모로부터 검색어 반응형 데이터를 전달받아 표시 (`props`)
- 도시 검색 시 `update-query` 이벤트를 발생시키면서 검색어를 부모에게 전달 (`emits`)

## 4. WeatherCard.vue

- 선택된 도시 객체를 전달받아 표시 (`props`)
- 카드를 선택하는 것(`select-card` 이벤트)과 상세보기(`click-detail` 이벤트)를 부모에게 전달 (`emits`)

## 5. 스타일 분리

- 각 컴포넌트로 분리하면서 해당 컴포넌트의 디자인은 `<style scoped>`로 각각 분리

## 6. [참고] Slot과 스코프

- Slot으로 전달되는 자식 컴포넌트(SearchBar, WeatherCard)는 시각적으로는 BaseDashboardCard 내부에 위치하지만, 스크립트적으로는 부모 컴포넌트의 스코프에서 컴파일되고 평가됨
- 따라서 WeatherParent에서 SearchBar, WeatherCard와 직접 바인딩/통신 가능

## 7. 추가 구현

- 본인의 Mockup 부분에서 추가로 Component를 만들거나, 위 Component를 더 분리하여 추가 Component를 만든다
