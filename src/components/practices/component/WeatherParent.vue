<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// 모든 반응형 데이터는 WeatherParent가 유지
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 32, status: '맑음', humidity: 45, rainChance: 10 },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 80,
    rainChance: 80,
    rainfall: 12,
  },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 65, rainChance: 30 },
  {
    id: 'city_04',
    name: '대전',
    temp: 18,
    status: '눈',
    humidity: 55,
    rainChance: 70,
    rainfall: 4,
  },
  { id: 'city_05', name: '광주', temp: 30, status: '맑음', humidity: 40, rainChance: 5 },
  {
    id: 'city_06',
    name: '제주',
    temp: 22,
    status: '비',
    humidity: 85,
    rainChance: 90,
    rainfall: 25,
  },
])

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

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
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
    <h2 class="app__title">⛅️ 과제 3: 날씨 (컴포넌트)</h2>

    <!-- BaseDashboardCard의 기본 슬롯에 SearchBar를 주입 -->
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="onUpdateQuery" />
      <p class="search__echo">검색 중인 도시: {{ searchQuery || '없음' }}</p>
    </BaseDashboardCard>

    <!-- BaseDashboardCard의 기본 슬롯에 날씨 카드 목록을, extra 슬롯에 정렬 버튼을 주입 -->
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
          @click-detail="showDetail"
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
  margin: 40px auto;
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
