<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherStore } from '../stores/weatherStore'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()
const weatherStore = useWeatherStore()

// 날씨 데이터는 weatherStore가 OpenWeatherMap API로 채움 (Home/Detail이 공유)
const weatherList = computed(() => weatherStore.citiesWithWeather)

onMounted(() => {
  weatherStore.fetchAllCurrent()
})

const searchQuery = ref('')
const onUpdateQuery = (value) => {
  searchQuery.value = value
}

const filteredWeatherList = computed(() =>
  weatherList.value.filter((city) => city.name.includes(searchQuery.value)),
)

const selectedCityInfo = ref(null)
const selectCity = (city) => {
  selectedCityInfo.value = city
}

// alert() 대신 Programmatic Navigation으로 상세 페이지 이동
const goToDetail = (city) => {
  router.push('/weather/' + city.id)
}

watch(selectedCityInfo, (city) => {
  const message = city ? `${city.name}이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.'
  console.log('[watch] 상태바 문구 변경:', message)
})

watchEffect(() => {
  console.log('[watchEffect] searchQuery:', searchQuery.value)
})

const sortOrder = ref('desc')
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const sortedWeatherList = computed(() =>
  [...filteredWeatherList.value].sort((a, b) =>
    sortOrder.value === 'asc' ? a.temp - b.temp : b.temp - a.temp,
  ),
)

watch(sortOrder, (order) => {
  console.log('[watch] 정렬 순서 변경:', order === 'asc' ? '오름차순' : '내림차순')
})

// 상단 요약 통계 (표시 전용, 별도 로직 없음)
const averageTemp = computed(() => {
  if (weatherList.value.length === 0) return null
  const sum = weatherList.value.reduce((acc, city) => acc + city.temp, 0)
  return Math.round(sum / weatherList.value.length)
})
const goodRoundingCount = computed(
  () => weatherList.value.filter((city) => city.temp > 18 && city.temp <= 30).length,
)
// 미세먼지 API 기반 추가 정보: 대기질 좋음/보통인 골프장 수
const cleanAirCount = computed(
  () => weatherList.value.filter((city) => city.airQuality && city.airQuality.aqi <= 2).length,
)
</script>

<template>
  <div class="page-body">
    <section class="banner">
      <div class="banner__text">
        <h2 class="banner__title">오늘, 라운딩하기 좋은 골프장은 어디일까요?</h2>
        <p class="banner__desc">전국 골프장 실시간 날씨와 티오프 가능 시간을 한눈에 확인하세요.</p>
      </div>
      <div class="banner__stats">
        <div class="stat">
          <span class="stat__value">{{ weatherList.length }}</span>
          <span class="stat__label">등록 골프장</span>
        </div>
        <div class="stat">
          <span class="stat__value">{{ averageTemp ?? '-' }}°</span>
          <span class="stat__label">평균 기온</span>
        </div>
        <div class="stat stat--highlight">
          <span class="stat__value">{{ goodRoundingCount }}</span>
          <span class="stat__label">라운딩 추천</span>
        </div>
        <div class="stat">
          <span class="stat__value">🌫️ {{ cleanAirCount }}</span>
          <span class="stat__label">대기질 양호</span>
        </div>
      </div>
    </section>

    <BaseDashboardCard title="🔍 골프장 검색">
      <SearchBar :search-query="searchQuery" @update-query="onUpdateQuery" />
      <p class="search__echo">검색 중인 골프장: {{ searchQuery || '없음' }}</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="📋 골프장별 날씨 현황">
      <template #extra>
        <el-button size="small" round @click="toggleSortOrder">
          기온 {{ sortOrder === 'asc' ? '오름차순 ⬆️' : '내림차순 ⬇️' }}
        </el-button>
      </template>

      <el-skeleton v-if="weatherStore.loading" :rows="4" animated />
      <el-alert
        v-else-if="weatherStore.error"
        :title="weatherStore.error"
        type="error"
        :closable="false"
        show-icon
      />
      <el-alert
        v-else-if="filteredWeatherList.length === 0"
        :title="`'${searchQuery}'와 일치하는 골프장이 없습니다.`"
        type="info"
        :closable="false"
        show-icon
      />
      <div v-else class="card-list">
        <WeatherCard
          v-for="city in sortedWeatherList"
          :key="city.id"
          :city="city"
          @select-card="selectCity"
          @click-detail="goToDetail"
        />
      </div>
    </BaseDashboardCard>

    <el-alert
      class="notice"
      :title="
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다.`
          : '카드를 클릭하거나 검색해 보세요.'
      "
      type="success"
      :closable="false"
      center
    />
  </div>
</template>

<style scoped>
.page-body {
  color: #1e293b;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  background: linear-gradient(120deg, var(--golf-green-800), var(--golf-green-500));
  color: #fff;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 20px;
}

.banner__title {
  font-size: 19px;
  font-weight: 800;
  margin: 0 0 6px;
}

.banner__desc {
  font-size: 13px;
  color: #dcfce7;
  margin: 0;
}

.banner__stats {
  display: flex;
  gap: 10px;
}

.stat {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 78px;
}

.stat--highlight {
  background: var(--golf-sand);
  color: var(--golf-green-950);
}

.stat__value {
  font-size: 20px;
  font-weight: 800;
}

.stat__label {
  font-size: 10px;
  opacity: 0.85;
}

.search__echo {
  font-size: 12px;
  color: var(--golf-green-700);
  margin: 10px 0 0;
  font-weight: 500;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.notice {
  margin-top: 16px;
}
</style>
