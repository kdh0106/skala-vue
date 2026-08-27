<script setup></script>

<template>
  <div class="app app--center">
    <div class="icon">🌞❓</div>
    <p class="title">페이지를 찾을 수 없습니다.</p>
    <p class="desc">요청하신 주소가 존재하지 않거나, 이미 개편되었거나 삭제되었습니다.</p>
    <RouterLink to="/" class="back-btn">날씨 메인으로 이동</RouterLink>
  </div>
</template>

<style scoped>
.app {
  width: 560px;
  margin: 0 auto 40px;
  padding: 48px 40px;
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

.app--center {
  text-align: center;
}

.icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px;
}

.desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 20px;
}

.back-btn {
  display: inline-block;
  background: #4338ca;
  color: #fff;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
</style>
