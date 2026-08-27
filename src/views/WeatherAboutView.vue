<script setup></script>

<template>
  <div class="app">
    <h2 class="app__title">⛳ 골프장 날씨 (Axios)</h2>

    <div class="panel">
      <h3 class="panel__title">ℹ️ 서비스 소개</h3>
      <p class="desc">
        본 앱은 전국 골프장의 실시간 날씨와 일몰 시각을 보여주는 실습용 가상 대시보드 서비스입니다.
      </p>
      <ul class="feature-list">
        <li>🔍 골프장 이름 검색 &amp; 온도순 정렬</li>
        <li>🖥️ 반응형 카드 UI로 골프장별 날씨 현황 표시</li>
        <li>🔗 URL 파라미터로 골프장별 상세 관측 정보 조회</li>
        <li>🌇 일몰 시각 기반 마지막 티오프 시간 안내</li>
      </ul>
    </div>

    <RouterLink to="/" class="back-btn">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.app {
  width: 560px;
  margin: 0 auto 40px;
  padding: 36px 40px;
  font-family:
    'Pretendard',
    -apple-system,
    'Apple SD Gothic Neo',
    sans-serif;
  color: #1e293b;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 40px -12px rgba(30, 41, 59, 0.18);
}

.app__title {
  font-size: 19px;
  font-weight: 700;
  margin: 0 0 18px;
  color: #0f172a;
}

.panel {
  background: linear-gradient(135deg, #eef2ff 0%, #f5f8ff 100%);
  border: 1px solid #e0e7ff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
}

.panel__title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #4338ca;
  margin: 0 0 10px;
}

.desc {
  font-size: 13px;
  color: #475569;
  margin: 0 0 10px;
}

.feature-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.back-btn {
  display: block;
  text-align: center;
  background: #0f172a;
  color: #fff;
  border-radius: 999px;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 16px;
}
</style>
