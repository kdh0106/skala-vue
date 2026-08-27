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
const airA = computed(() => weatherStore.airQualityByCityId[cityIdA.value])
const airB = computed(() => weatherStore.airQualityByCityId[cityIdB.value])

// 선택된 두 도시의 실시간 날씨 + 대기질을 불러오고, 선택이 바뀔 때마다 URL 쿼리스트링에도 반영
watch(
  [cityIdA, cityIdB],
  ([a, b]) => {
    weatherStore.fetchCurrentWeatherFor(a)
    weatherStore.fetchCurrentWeatherFor(b)
    weatherStore.fetchAirQualityFor(a) // 미세먼지 API 기반 추가 정보
    weatherStore.fetchAirQualityFor(b)
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
  // 미세먼지 API 기반 추가 정보: PM2.5 비교 (둘 다 불러와졌을 때만 표시)
  ...(airA.value && airB.value
    ? [
        {
          label: '🌫️ 미세먼지',
          a: `${airA.value.pm25}㎍/m³ (${airA.value.pm25Level})`,
          b: `${airB.value.pm25}㎍/m³ (${airB.value.pm25Level})`,
          higherIsA: airA.value.pm25 > airB.value.pm25,
        },
      ]
    : []),
])
</script>

<template>
  <div class="page-body">
    <section class="page-hero">
      <h2 class="page-hero__title">🆚 골프장 비교</h2>
      <p class="page-hero__desc">두 골프장의 실시간 날씨를 나란히 비교해보세요.</p>
    </section>

    <el-card class="panel" shadow="never">
      <template #header>
        <span class="panel__title">📊 비교 결과</span>
      </template>
      <div class="picker-row">
        <el-select v-model="cityIdA" class="picker">
          <el-option
            v-for="city in weatherStore.cities"
            :key="city.id"
            :label="city.name"
            :value="city.id"
          />
        </el-select>
        <span class="vs">VS</span>
        <el-select v-model="cityIdB" class="picker">
          <el-option
            v-for="city in weatherStore.cities"
            :key="city.id"
            :label="city.name"
            :value="city.id"
          />
        </el-select>
      </div>

      <el-table v-if="currentA && currentB" :data="rows" class="compare-table">
        <el-table-column prop="label" label="" width="90" />
        <el-table-column :label="`${cityA.name}(${currentA.status})`" align="center">
          <template #default="{ row }">
            <span :class="{ highlight: row.higherIsA }">{{ row.a }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="`${cityB.name}(${currentB.status})`" align="center">
          <template #default="{ row }">
            <span :class="{ highlight: !row.higherIsA }">{{ row.b }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        v-else-if="weatherStore.error"
        :title="weatherStore.error"
        type="error"
        :closable="false"
        show-icon
      />
      <el-skeleton v-else :rows="3" animated />
    </el-card>

    <el-button class="back-btn" round @click="router.push('/')"
      >← 메인 대시보드로 돌아가기</el-button
    >
  </div>
</template>

<style scoped>
.page-body {
  color: #1e293b;
}

.page-hero {
  background: linear-gradient(120deg, var(--golf-green-800), var(--golf-green-500));
  color: #fff;
  border-radius: 18px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

.page-hero__title {
  font-size: 19px;
  font-weight: 800;
  margin: 0 0 4px;
}

.page-hero__desc {
  font-size: 13px;
  color: #dcfce7;
  margin: 0;
}

.panel {
  margin-bottom: 14px;
}

.panel__title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--golf-green-800);
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.picker {
  flex: 1;
}

.vs {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.compare-table {
  width: 100%;
}

.compare-table :deep(.highlight) {
  color: var(--golf-green-700);
  font-weight: 700;
}

.back-btn {
  width: 100%;
  margin-top: 16px;
}
</style>
