<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { weatherMockData } from '../mocks/weatherMockData'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()

// 모든 반응형 데이터는 WeatherHomeView가 유지 (기존 WeatherParent 역할 대체)
const weatherList = ref(weatherMockData)

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
    <h2 class="app__title">⛅️ 과제 4: 라우터 적용</h2>

    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="onUpdateQuery" />
      <p class="search__echo">검색 중인 도시: {{ searchQuery || '없음' }}</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="📋 지역별 날씨 현황">
      <template #extra>
        <button class="sort-btn" @click="toggleSortOrder">
          기온 {{ sortOrder === 'asc' ? '오름차순 ⬆️' : '내림차순 ⬇️' }}
        </button>
      </template>

      <p v-if="filteredWeatherList.length === 0" class="empty">
        "{{ searchQuery }}"와 일치하는 도시가 없습니다.
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
