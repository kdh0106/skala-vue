<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { useWeatherStore } from '../stores/weatherStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

// Mount 시점에 동적 경로 파라미터(cityId)로 실시간 날씨 + 5일 예보 + 일몰 + 대기질 조회
const city = computed(() => weatherStore.getCityById(route.params.cityId))
const current = computed(() => weatherStore.currentByCityId[route.params.cityId])
const forecast = computed(() => weatherStore.forecastByCityId[route.params.cityId])
const sunset = computed(() => weatherStore.sunsetByCityId[route.params.cityId])
const airQuality = computed(() => weatherStore.airQualityByCityId[route.params.cityId])

onMounted(() => {
  weatherStore.fetchCurrentWeatherFor(route.params.cityId)
  weatherStore.fetchForecastFor(route.params.cityId) // OpenWeatherMap 추가 API: 5일 예보
  weatherStore.fetchAirQualityFor(route.params.cityId) // OpenWeatherMap 추가 API: 대기질
  weatherStore.fetchSunsetFor(route.params.cityId) // 기타 외부 API: 일몰 → 마지막 티오프 시각
})

const AQI_COLORS = { 1: '#40916c', 2: '#84cc16', 3: '#f59e0b', 4: '#f97316', 5: '#ef4444' }
const aqiColor = computed(() => AQI_COLORS[airQuality.value?.aqi] ?? '#94a3b8')

const displayTemp = computed(() => {
  const rawTemp = current.value.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

// 본인 추가 store 활용: 풍속 단위(m/s ↔ mph) 변환
const displayWindSpeed = computed(() => {
  const rawWindSpeed = current.value.windSpeed
  if (configStore.windUnit === 'mph') {
    return (rawWindSpeed * 2.23694).toFixed(1)
  }
  return rawWindSpeed
})
</script>

<template>
  <div class="page-body">
    <template v-if="city">
      <section
        v-if="current"
        class="hero-card"
        :style="{
          backgroundImage: `linear-gradient(120deg, rgba(11,46,31,0.88), rgba(45,106,79,0.72)), url(${city.photo})`,
        }"
      >
        <div class="hero-card__main">
          <p class="hero-card__eyebrow">⛳ {{ city.region }}</p>
          <h2 class="hero-card__name">{{ city.name }}</h2>
          <div class="hero-card__temp-row">
            <img
              :src="`https://openweathermap.org/img/wn/${current.icon}@2x.png`"
              class="hero-card__icon"
              alt=""
            />
            <span class="hero-card__temp">{{ displayTemp }}°</span>
            <span class="hero-card__unit">{{ configStore.unitSymbol }}</span>
          </div>
          <p class="hero-card__status">{{ current.status }}</p>
        </div>
        <div class="hero-card__stats">
          <div class="stat-pill">
            <span class="stat-pill__label">💧 습도</span>
            <span class="stat-pill__value">{{ current.humidity }}%</span>
          </div>
          <div class="stat-pill">
            <span class="stat-pill__label">🍃 풍속</span>
            <span class="stat-pill__value">
              {{ displayWindSpeed }}{{ configStore.windUnitSymbol }}
            </span>
            <el-button size="small" round @click="configStore.toggleWindUnit">단위변경</el-button>
          </div>
        </div>
      </section>
      <el-alert
        v-else-if="weatherStore.error"
        :title="weatherStore.error"
        type="error"
        :closable="false"
        show-icon
      />
      <el-skeleton v-else :rows="3" animated />

      <section v-if="sunset" class="tee-card">
        <div class="tee-card__item">
          <span class="tee-card__icon">🌇</span>
          <div>
            <p class="tee-card__label">오늘의 일몰</p>
            <p class="tee-card__value">{{ sunset.sunset }} (KST)</p>
          </div>
        </div>
        <div class="tee-card__divider" />
        <div class="tee-card__item">
          <span class="tee-card__icon">⛳</span>
          <div>
            <p class="tee-card__label">마지막 티오프 권장</p>
            <p class="tee-card__value">{{ sunset.lastTeeTime }} (일몰 1시간 전)</p>
          </div>
        </div>
      </section>

      <el-card v-if="airQuality" class="panel" shadow="never">
        <template #header>
          <span class="panel__title">🌫️ 대기질 정보</span>
        </template>
        <div class="aqi-row">
          <el-tag :color="aqiColor" effect="dark" round>{{ airQuality.aqiLabel }}</el-tag>
          <span class="aqi-row__item"
            >PM2.5 {{ airQuality.pm25 }}㎍/m³ ({{ airQuality.pm25Level }})</span
          >
          <span class="aqi-row__item">PM10 {{ airQuality.pm10 }}㎍/m³</span>
        </div>
        <p v-if="airQuality.maskRecommended" class="aqi-tip">
          😷 미세먼지 농도가 높아요, 마스크 착용을 권장해요
        </p>
        <p v-else class="aqi-tip">🌿 대기질이 양호해요, 편하게 라운딩하세요</p>
      </el-card>

      <el-card v-if="forecast" class="panel" shadow="never">
        <template #header>
          <span class="panel__title">📅 5일 예보</span>
        </template>
        <ul class="forecast-list">
          <li v-for="day in forecast" :key="day.date" class="forecast-list__item">
            <img
              :src="`https://openweathermap.org/img/wn/${day.icon}.png`"
              class="forecast-list__icon"
              alt=""
            />
            <span class="forecast-list__date">{{ day.date.slice(5) }}</span>
            <span class="forecast-list__temp">{{ day.temp }}°C</span>
          </li>
        </ul>
      </el-card>
    </template>
    <el-alert
      v-else
      :title="`'${route.params.cityId}'에 해당하는 골프장 정보를 찾을 수 없습니다.`"
      type="warning"
      :closable="false"
      show-icon
    />

    <el-button class="back-btn" round @click="router.push('/')"
      >← 메인 대시보드로 돌아가기</el-button
    >
  </div>
</template>

<style scoped>
.page-body {
  color: #1e293b;
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  background-size: cover;
  background-position: center;
  color: #fff;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 16px;
}

.hero-card__eyebrow {
  font-size: 12px;
  color: #bdeeda;
  margin: 0 0 4px;
}

.hero-card__name {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 8px;
}

.hero-card__temp-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.hero-card__icon {
  width: 52px;
  height: 52px;
  margin-right: 4px;
}

.hero-card__temp {
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
}

.hero-card__unit {
  font-size: 16px;
  color: #dcfce7;
}

.hero-card__status {
  font-size: 13px;
  color: #dcfce7;
  margin: 4px 0 0;
}

.hero-card__stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
}

.stat-pill__label {
  color: #dcfce7;
}

.stat-pill__value {
  font-weight: 700;
}

.tee-card {
  display: flex;
  align-items: center;
  background: linear-gradient(120deg, #fdf6e3, #fbecc4);
  border: 1px solid var(--golf-sand);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.tee-card__item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.tee-card__icon {
  font-size: 24px;
}

.tee-card__label {
  font-size: 11px;
  color: var(--golf-sand-dark);
  margin: 0;
}

.tee-card__value {
  font-size: 15px;
  font-weight: 700;
  color: var(--golf-green-950);
  margin: 2px 0 0;
}

.tee-card__divider {
  width: 1px;
  align-self: stretch;
  background: var(--golf-sand);
  margin: 0 16px;
}

.panel {
  margin-bottom: 14px;
}

.aqi-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #475569;
}

.aqi-tip {
  font-size: 11px;
  color: var(--golf-green-700);
  background: var(--golf-green-100);
  border-radius: 8px;
  padding: 6px 8px;
  margin: 10px 0 0;
}

.panel__title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--golf-green-800);
}

.forecast-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  gap: 6px;
}

.forecast-list__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: var(--golf-green-100);
  border-radius: 8px;
  padding: 8px 4px;
}

.forecast-list__icon {
  width: 28px;
  height: 28px;
}

.forecast-list__date {
  font-size: 11px;
  color: #64748b;
}

.forecast-list__temp {
  font-size: 12px;
  font-weight: 700;
  color: var(--golf-green-950);
}

.back-btn {
  width: 100%;
  margin-top: 16px;
}
</style>
