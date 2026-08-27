<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore'

// 본인 추가 view: 두 도시를 쿼리스트링(?a=cityId&b=cityId)으로 비교
const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()

const cityIdA = ref(route.query.a || weatherStore.cities[0].id)
const cityIdB = ref(route.query.b || weatherStore.cities[1].id)

const cityA = computed(() => weatherStore.getCityById(cityIdA.value))
const cityB = computed(() => weatherStore.getCityById(cityIdB.value))
const currentA = computed(() => weatherStore.currentByCityId[cityIdA.value])
const currentB = computed(() => weatherStore.currentByCityId[cityIdB.value])

// 선택된 두 도시의 실시간 날씨를 불러오고, 선택이 바뀔 때마다 URL 쿼리스트링에도 반영
watch(
  [cityIdA, cityIdB],
  ([a, b]) => {
    weatherStore.fetchCurrentWeatherFor(a)
    weatherStore.fetchCurrentWeatherFor(b)
    router.replace({ query: { a, b } }) // replace를 써서 히스토리가 안 쌓이게 함
  },
  { immediate: true },
)

const rows = computed(() => [
  {
    label: '🌡 기온',
    a: `${currentA.value.temp}°C`,
    b: `${currentB.value.temp}°C`,
    higherIsA: currentA.value.temp > currentB.value.temp,
  },
  {
    label: '💧 습도',
    a: `${currentA.value.humidity}%`,
    b: `${currentB.value.humidity}%`,
    higherIsA: currentA.value.humidity > currentB.value.humidity,
  },
  {
    label: '🍃 풍속',
    a: `${currentA.value.windSpeed}m/s`,
    b: `${currentB.value.windSpeed}m/s`,
    higherIsA: currentA.value.windSpeed > currentB.value.windSpeed,
  },
])
</script>

<template>
  <div class="app">
    <h2 class="app__title">⛳ 골프장 날씨 (Axios)</h2>

    <div class="panel">
      <h3 class="panel__title">🆚 골프장 비교</h3>
      <div class="picker-row">
        <select v-model="cityIdA" class="picker">
          <option v-for="city in weatherStore.cities" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
        <span class="vs">VS</span>
        <select v-model="cityIdB" class="picker">
          <option v-for="city in weatherStore.cities" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
      </div>

      <table v-if="currentA && currentB" class="compare-table">
        <thead>
          <tr>
            <th>{{ cityA.name }}({{ currentA.status }})</th>
            <th></th>
            <th>{{ cityB.name }}({{ currentB.status }})</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.label">
            <td :class="{ highlight: row.higherIsA }">{{ row.a }}</td>
            <td class="row-label">{{ row.label }}</td>
            <td :class="{ highlight: !row.higherIsA }">{{ row.b }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="weatherStore.error" class="empty empty--error">{{ weatherStore.error }}</p>
      <p v-else class="empty">날씨 정보를 불러오는 중...</p>
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

.picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.picker {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
}

.vs {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.compare-table th,
.compare-table td {
  padding: 8px 6px;
  text-align: center;
}

.compare-table thead th {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
}

.row-label {
  color: #94a3b8;
  font-size: 12px;
  white-space: nowrap;
}

.compare-table td.highlight {
  color: #4338ca;
  font-weight: 700;
}

.empty {
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  padding: 20px 0;
}

.empty--error {
  color: #dc2626;
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
