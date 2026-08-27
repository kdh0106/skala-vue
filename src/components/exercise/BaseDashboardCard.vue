<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <el-card class="panel" shadow="never">
    <template #header>
      <div class="panel__row">
        <span class="panel__title">{{ title }}</span>
        <!-- 부모(WeatherHomeView)가 정렬 버튼 등 부가 UI를 주입하는 슬롯 -->
        <slot name="extra" />
      </div>
    </template>
    <!-- 부모가 골프장 검색 / 날씨 현황 UI를 주입하는 기본 슬롯 -->
    <slot />
  </el-card>
</template>

<style scoped>
.panel {
  margin-bottom: 16px;
  border-radius: 14px;
  border-top: 3px solid var(--golf-green-500);
}

.panel__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel__title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--golf-green-800);
}
</style>
