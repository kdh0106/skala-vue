# Hands on - Weather Router (2일차)

## 프로젝트 폴더 트리

```
src/
├─ main.js              # 라우터 인스턴스 전역 주입 (.use(router))
├─ App.vue              # 내비게이션 바(<RouterLink>) 및 메인 수문장(<RouterView />) 배치
├─ router/
│  └─ index.js          # 라우트 규칙(routes 배열) 정의 및 Lazy Loading 설정
├─ components/
│  └─ exercise/         # ★ 실습용 부품 컴포넌트 격리 폴더
│     ├─ BaseDashboardCard.vue
│     ├─ SearchBar.vue
│     └─ WeatherCard.vue
└─ views/                # 페이지 단위 컴포넌트 보관 폴더
   ├─ WeatherHomeView.vue    # 메인 날씨 대시보드 화면
   ├─ WeatherAboutView.vue   # 서비스 소개용 정적 페이지
   ├─ WeatherDetailView.vue  # :cityId 패턴을 수신하는 동적 상세 페이지
   └─ NotFoundView.vue       # 정의되지 않은 경로 접근 시 (Catch-all Route)
```

## 과제 요구사항

1. **Vue Router 설정**: 라우터 지연 로딩(Lazy Loading) 적용, Catch-all Route 적용
2. **App.vue**: Navigation Bar 추가(`<RouterLink>`) 및 메인 콘텐츠 영역 배치(`<RouterView>`)
3. **WeatherHomeView.vue**: 기존 `WeatherParent`를 대체 (`WeatherParent`를 참고하여 `/` 경로에 맞게 작성)
   - 상세보기 버튼 클릭 시 `window.alert()`를 제거하고, Programmatic Navigation으로 처리 (`router.push('/weather/' + id)`)
4. **WeatherDetailView.vue**: 지역별 상세 기상관측 정보를 보여주는 페이지
   - 도시 코드에 해당하는 Mock Data를 임시로 활용
   - Router 동적 경로 매칭에 해당되는 도시ID(`cityId`)를 기반으로 Mount 시점에 Mock Data에서 도시 객체 선택
5. **WeatherAboutView.vue**: 적당한 내용 작성 및 메인 대시보드로 돌아가기 버튼 작성
6. 상기 정의된 view 이외에 본인의 추가 view를 작성하고 Routing 한다.

## 참고 화면 (스크린샷 기준)

- `/` : 날씨 대시보드(도시 검색 + 카드 리스트) — 상단에 "날씨 대시보드" / "서비스 소개" 탭
- `/about` : 서비스 소개 정적 페이지, "메인 대시보드로 돌아가기" 버튼
- `/weather/:cityId` (예: `/weather/city_01`) : 선택 도시의 상세 기상 관측 정보(지정 지역, 실시간 기온, 기상 현황, 대기 습도, 현재 풍속) + "메인 대시보드로 돌아가기" 버튼
- 정의되지 않은 경로(예: `/kr`) : Catch-all → 404 페이지("페이지를 찾을 수 없습니다" + "날씨 메인으로 이동" 버튼)
