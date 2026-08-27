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
</script>

<template>
  <div class="app">
    <h2 class="app__title">⛳ 골프장 날씨 (Axios)</h2>

    <BaseDashboardCard title="🔍 골프장 검색">
      <SearchBar :search-query="searchQuery" @update-query="onUpdateQuery" />
      <p class="search__echo">검색 중인 골프장: {{ searchQuery || '없음' }}</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="📋 골프장별 날씨 현황">
      <template #extra>
        <button class="sort-btn" @click="toggleSortOrder">
          기온 {{ sortOrder === 'asc' ? '오름차순 ⬆️' : '내림차순 ⬇️' }}
        </button>
      </template>

      <p v-if="weatherStore.loading" class="empty">날씨 정보를 불러오는 중...</p>
      <p v-else-if="weatherStore.error" class="empty empty--error">{{ weatherStore.error }}</p>
      <p v-else-if="filteredWeatherList.length === 0" class="empty">
        "{{ searchQuery }}"와 일치하는 골프장이 없습니다.
      </p>
      <ul v-else class="card-list">
        <WeatherCard
          v-for="city in sortedWeatherList"
          :key="city.id"
          :city="city"
          @select-card="selectCity"
          @click-detail="goToDetail"
        />
      </ul>
    </BaseDashboardCard>

    <p class="notice">
      {{
        selectedCityInfo
          ? `${selectedCityInfo.name}이 선택되었습니다.`
          : '카드를 클릭하거나 검색해 보세요.'
      }}
    </p>
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

.search__echo {
  font-size: 12px;
  color: #6366f1;
  margin: 10px 0 0;
  font-weight: 500;
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

.card-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.sort-btn {
  border: 1px solid #c7d2fe;
  background: #fff;
  color: #4338ca;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
}

.notice {
  text-align: center;
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  margin: 16px 0 0;
}
</style>
