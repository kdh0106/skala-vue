<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="page">
    <div class="topbar">
      <nav class="nav">
        <RouterLink to="/" class="nav__link">📋 날씨 대시보드</RouterLink>
        <RouterLink to="/about" class="nav__link">ℹ️ 서비스 소개</RouterLink>
        <RouterLink to="/compare" class="nav__link">🆚 도시 비교</RouterLink>
      </nav>
      <UnitToggler />
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
}

.topbar {
  width: 100%;
  max-width: 640px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav__link {
  background: #fff;
  color: #4338ca;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.nav__link.router-link-exact-active {
  background: #4338ca;
  color: #fff;
  border-color: #4338ca;
}
</style>
