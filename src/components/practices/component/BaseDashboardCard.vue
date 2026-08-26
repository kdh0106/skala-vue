<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <section class="panel">
    <div class="panel__row">
      <h3 class="panel__title">{{ title }}</h3>
      <!-- 부모(WeatherParent)가 정렬 버튼 등 부가 UI를 주입하는 슬롯 -->
      <slot name="extra" />
    </div>
    <!-- 부모가 도시 검색 / 날씨 현황 UI를 주입하는 기본 슬롯 -->
    <slot />
  </section>
</template>

<style scoped>
.panel {
  background: linear-gradient(135deg, #eef2ff 0%, #f5f8ff 100%);
  border: 1px solid #e0e7ff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
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
  color: #4338ca;
  margin: 0 0 10px;
}
</style>
