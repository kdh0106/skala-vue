<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="page">
    <header class="hero">
      <div class="hero__inner">
        <div class="brand">
          <span class="brand__icon">⛳</span>
          <div class="brand__text">
            <strong>골프장 웨더</strong>
            <span>전국 골프장 실시간 라운딩 날씨</span>
          </div>
        </div>
        <el-menu
          :default-active="$route.path"
          mode="horizontal"
          router
          class="nav"
          background-color="transparent"
          text-color="#eafff1"
          active-text-color="#ffffff"
          :ellipsis="false"
        >
          <el-menu-item index="/">🏌️ 대시보드</el-menu-item>
          <el-menu-item index="/about">ℹ️ 소개</el-menu-item>
          <el-menu-item index="/compare">🆚 비교</el-menu-item>
        </el-menu>
      </div>
      <svg class="hero__wave" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path
          d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,32 L1440,60 L0,60 Z"
          fill="var(--fairway-bg)"
        />
      </svg>
    </header>

    <div class="toolbar">
      <UnitToggler />
    </div>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.page {
  --fairway-bg: #f3faf5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--fairway-bg);
}

.hero {
  position: relative;
  width: 100%;
  background: linear-gradient(120deg, var(--golf-green-950) 0%, var(--golf-green-700) 100%);
  padding: 18px 20px 0;
}

.hero__inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 14px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.brand__icon {
  font-size: 28px;
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.brand__text strong {
  font-size: 16px;
}

.brand__text span {
  font-size: 11px;
  color: #bdeeda;
}

.nav {
  border: none;
}

.hero__wave {
  display: block;
  width: 100%;
  height: 24px;
}

.toolbar {
  width: 100%;
  max-width: 960px;
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px 0;
}

.content {
  width: 100%;
  max-width: 960px;
  padding: 16px 20px 48px;
}
</style>
