<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { weatherMockData } from '../mocks/weatherMockData'

// 본인 추가 view: 두 도시를 쿼리스트링(?a=cityId&b=cityId)으로 비교
const route = useRoute()
const router = useRouter()

const cityIdA = ref(route.query.a || weatherMockData[0].id)
const cityIdB = ref(route.query.b || weatherMockData[1].id)

const cityA = computed(() => weatherMockData.find((city) => city.id === cityIdA.value))
const cityB = computed(() => weatherMockData.find((city) => city.id === cityIdB.value))

// 선택이 바뀔 때마다 URL 쿼리스트링에 반영 (뒤로가기 이력이 쌓이지 않도록 replace 사용)
watch([cityIdA, cityIdB], ([a, b]) => {
  router.replace({ query: { a, b } })
})

const rows = computed(() => [
  {
    label: '🌡 기온',
    a: `${cityA.value.temp}°C`,
    b: `${cityB.value.temp}°C`,
    higherIsA: cityA.value.temp > cityB.value.temp,
  },
  {
    label: '💧 습도',
    a: `${cityA.value.humidity}%`,
    b: `${cityB.value.humidity}%`,
    higherIsA: cityA.value.humidity > cityB.value.humidity,
  },
  {
    label: '☔ 강수확률',
    a: `${cityA.value.rainChance}%`,
    b: `${cityB.value.rainChance}%`,
    higherIsA: cityA.value.rainChance > cityB.value.rainChance,
  },
  {
    label: '🍃 풍속',
    a: `${cityA.value.windSpeed}m/s`,
    b: `${cityB.value.windSpeed}m/s`,
    higherIsA: cityA.value.windSpeed > cityB.value.windSpeed,
  },
])
</script>

<template>
  <div class="app">
    <h2 class="app__title">⛅️ 과제 4: 라우터 적용</h2>

    <div class="panel">
      <h3 class="panel__title">🆚 도시 비교</h3>
      <div class="picker-row">
        <select v-model="cityIdA" class="picker">
          <option v-for="city in weatherMockData" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
        <span class="vs">VS</span>
        <select v-model="cityIdB" class="picker">
          <option v-for="city in weatherMockData" :key="city.id" :value="city.id">
            {{ city.name }}
          </option>
        </select>
      </div>

      <table class="compare-table">
        <thead>
          <tr>
            <th>{{ cityA.name }}({{ cityA.status }})</th>
            <th></th>
            <th>{{ cityB.name }}({{ cityB.status }})</th>
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
