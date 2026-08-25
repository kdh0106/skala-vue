<script setup>
import { ref } from 'vue'

// 1. 배열 렌더링 (v-for)에 쓰일 날씨 데이터
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

// 3. 양방향 바인딩 (:value, @input)으로 검색 입력값을 관리
const keyword = ref('')
const onInput = (e) => {
  keyword.value = e.target.value
}

// 4. 이벤트: 카드 클릭 시 선택된 도시 표시
const selectedCity = ref('')
const selectCity = (cityName) => {
  selectedCity.value = cityName
}

// 4. 이벤트: 상세보기 버튼 클릭 시 날씨 정보 alert (카드 클릭과 버블링되지 않도록 별도 처리)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="app">
    <h2 class="app__title">⛅️ 과제 1: 날씨 (Mockup)</h2>

    <section class="panel">
      <h3 class="panel__title">🔍 도시 검색</h3>
      <!-- 3. :value / @input 양방향 바인딩 -->
      <div class="search-wrap">
        <span class="search-wrap__icon">🔍</span>
        <input
          class="search"
          type="text"
          placeholder="검색할 도시 이름 입력"
          :value="keyword"
          @input="onInput"
        />
      </div>
      <p class="search__echo">검색 중인 도시: {{ keyword || '없음' }}</p>
    </section>

    <section class="panel">
      <h3 class="panel__title">📋 지역별 날씨 현황</h3>
      <!-- 1. v-for로 날씨 카드 반복 렌더링, :key에 id 바인딩 -->
      <ul class="card-list">
        <li
          v-for="city in weatherList"
          :key="city.id"
          class="card"
          :class="
            city.temp <= 18
              ? 'card--cold'
              : city.temp <= 25
                ? 'card--cool'
                : city.temp <= 30
                  ? 'card--mild'
                  : 'card--warm'
          "
          @click="selectCity(city.name)"
        >
          <!-- 4. 카드 클릭 이벤트(@click)와 버튼 클릭(@click.stop)이 서로 버블링 없이 동작 -->
          <div class="card__row">
            <span class="card__name">{{ city.name }}({{ city.status }})</span>
            <button class="card__btn" @click.stop="showDetail(city.name, city.status)">
              상세보기
            </button>
          </div>
          <p class="card__temp">현재 기온: {{ city.temp }}°C · 습도 {{ city.humidity }}%</p>
          <!-- 2. v-if / v-else-if / v-else 조건부 렌더링 (기온 구간별 라벨) -->
          <div class="card__badges">
            <span v-if="city.temp <= 18" class="card__badge card__badge--cold">
              ❄️ 추움 (18도 이하)
            </span>
            <span v-else-if="city.temp <= 25" class="card__badge card__badge--cool">
              🍃 선선함 (19~25도)
            </span>
            <span v-else-if="city.temp <= 30" class="card__badge card__badge--mild">
              🌤 따뜻함 (26~30도)
            </span>
            <span v-else class="card__badge card__badge--warm"> 🔥 더움 (30도 초과) </span>

            <span v-if="city.status === '비'" class="card__badge card__badge--rain">
              ☔ 강수확률 {{ city.rainChance }}% · 강수량 {{ city.rainfall }}mm
            </span>
            <span v-else-if="city.status === '눈'" class="card__badge card__badge--rain">
              ❄️ 강수확률 {{ city.rainChance }}% · 적설량 {{ city.rainfall }}mm
            </span>
            <span v-else class="card__badge card__badge--rain-low">
              ☀️ 강수확률 {{ city.rainChance }}%
            </span>
          </div>
        </li>
      </ul>
    </section>

    <!-- 4. 상태바: 선택된 도시 표시 -->
    <p class="notice">
      {{ selectedCity ? `${selectedCity}이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.' }}
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

.search-wrap {
  position: relative;
}

.search-wrap__icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  opacity: 0.5;
}

.search {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px 10px 32px;
  border: 1px solid #c7d2fe;
  border-radius: 10px;
  font-size: 13px;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
}

.search:focus {
  border-color: #6366f1;
}

.search__echo {
  font-size: 12px;
  color: #6366f1;
  margin: 10px 0 0;
  font-weight: 500;
}

.card-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid transparent;
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -6px rgba(15, 23, 42, 0.15);
}

.card--warm {
  border-left-color: #f87171;
}

.card--mild {
  border-left-color: #fb923c;
}

.card--cool {
  border-left-color: #22d3ee;
}

.card--cold {
  border-left-color: #2563eb;
}

.card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card__name {
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
}

.card__btn {
  border: none;
  background: #eef2ff;
  color: #4338ca;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.card__btn:hover {
  background: #e0e7ff;
}

.card__temp {
  font-size: 12px;
  color: #64748b;
  margin: 8px 0 10px;
}

.card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card__badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  color: #fff;
}

.card__badge--warm {
  background: linear-gradient(135deg, #f87171, #ef4444);
}

.card__badge--mild {
  background: linear-gradient(135deg, #fb923c, #f97316);
}

.card__badge--cool {
  background: linear-gradient(135deg, #22d3ee, #06b6d4);
}

.card__badge--cold {
  background: linear-gradient(135deg, #60a5fa, #2563eb);
}

.card__badge--rain {
  background: linear-gradient(135deg, #94a3b8, #475569);
}

.card__badge--rain-low {
  background: #f1f5f9;
  color: #64748b;
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
