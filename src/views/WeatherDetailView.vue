<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { weatherMockData } from '../mocks/weatherMockData'
import { useConfigStore } from '../stores/configStore'

const route = useRoute()
const configStore = useConfigStore()

// Mount 시점에 동적 경로 파라미터(cityId)로 Mock Data에서 도시 객체 선택
const city = ref(null)
onMounted(() => {
  city.value = weatherMockData.find((item) => item.id === route.params.cityId) ?? null
})

const displayTemp = computed(() => {
  const rawTemp = city.value.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

// 본인 추가 store 활용: 풍속 단위(m/s ↔ mph) 변환
const displayWindSpeed = computed(() => {
  const rawWindSpeed = city.value.windSpeed
  if (configStore.windUnit === 'mph') {
    return (rawWindSpeed * 2.23694).toFixed(1)
  }
  return rawWindSpeed
})
</script>

<template>
  <div class="app">
    <h2 class="app__title">⛅️ 과제 4: 라우터 적용</h2>

    <div v-if="city" class="panel">
      <h3 class="panel__title">📡 지역별 상세 기상 관측 정보</h3>
      <ul class="detail-list">
        <li>🗺 지정 지역: {{ city.region }}</li>
        <li>🌡 실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</li>
        <li>🌤 기상 현황: {{ city.status }}</li>
        <li>💧 대기 습도: {{ city.humidity }}%</li>
        <li class="detail-list__row">
          <span>🍃 현재 풍속: {{ displayWindSpeed }}{{ configStore.windUnitSymbol }}</span>
          <button class="wind-unit-btn" @click="configStore.toggleWindUnit">단위변경</button>
        </li>
      </ul>
    </div>
    <p v-else class="empty">"{{ route.params.cityId }}"에 해당하는 도시 정보를 찾을 수 없습니다.</p>

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

.detail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #1e293b;
}

.detail-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wind-unit-btn {
  border: 1px solid #c7d2fe;
  background: #fff;
  color: #4338ca;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  padding: 20px 0;
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
