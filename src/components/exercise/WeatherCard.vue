<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'

// 선택된 도시 객체를 부모로부터 전달받아 표시 (props)
const props = defineProps({
  city: { type: Object, required: true },
})

// 카드 선택(select-card), 상세보기 클릭(click-detail)을 부모에 전달 (emits)
defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

// 온도 구간 분류는 원본(섭씨) 기준 그대로 유지, 화면 표시만 단위 설정을 따름
const tempClass = computed(() => {
  const t = props.city.temp
  if (t <= 18) return 'card--cold'
  if (t <= 25) return 'card--cool'
  if (t <= 30) return 'card--mild'
  return 'card--warm'
})

const displayTemp = computed(() => {
  const rawTemp = props.city.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

// 골프장 느낌을 살리는 한 줄 코멘트 (표시 전용, 온도 분류 로직과는 별개)
const roundingTip = computed(() => {
  const t = props.city.temp
  if (t <= 18) return '🧥 쌀쌀해요, 방한 준비하고 라운딩하세요'
  if (t <= 30) return '🏌️ 라운딩하기 좋은 날씨예요'
  return '🥵 무더위 주의, 수분 보충 필수예요'
})
</script>

<template>
  <el-card class="card" :class="tempClass" shadow="hover" @click="$emit('select-card', city)">
    <div class="card__photo">
      <img :src="city.photo" class="card__photo-img" alt="" />
      <div class="card__photo-scrim">
        <p class="card__name">⛳ {{ city.name }}</p>
        <p class="card__region">{{ city.region }}</p>
      </div>
    </div>
    <div class="card__strip" />
    <div class="card__body">
      <div class="card__temp-row">
        <img
          :src="`https://openweathermap.org/img/wn/${city.icon}@2x.png`"
          class="card__icon"
          alt=""
        />
        <span class="card__temp">{{ displayTemp }}°</span>
        <span class="card__temp-unit">{{ configStore.unitSymbol }}</span>
        <span class="card__status">{{ city.status }}</span>
      </div>

      <div class="card__stats">
        <span>💧 {{ city.humidity }}%</span>
        <span>🍃 {{ city.windSpeed }}m/s</span>
      </div>

      <p class="card__tip">{{ roundingTip }}</p>

      <div class="card__badges">
        <el-tag v-if="city.temp <= 18" effect="dark" round size="small" color="#2563eb">
          추움
        </el-tag>
        <el-tag v-else-if="city.temp <= 25" effect="dark" round size="small" color="#06b6d4">
          선선함
        </el-tag>
        <el-tag v-else-if="city.temp <= 30" effect="dark" round size="small" color="#40916c">
          쾌적함
        </el-tag>
        <el-tag v-else effect="dark" round size="small" color="#ef4444"> 더움 </el-tag>
      </div>

      <el-button class="card__btn" type="primary" round @click.stop="$emit('click-detail', city)">
        상세보기 →
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.card {
  cursor: pointer;
  overflow: hidden;
}

.card :deep(.el-card__body) {
  padding: 0;
}

.card__photo {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.card__photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__photo-scrim {
  position: absolute;
  inset: auto 0 0 0;
  padding: 24px 14px 10px;
  background: linear-gradient(to top, rgba(11, 46, 31, 0.85), rgba(11, 46, 31, 0));
}

.card__strip {
  height: 4px;
}

.card--warm .card__strip {
  background: linear-gradient(90deg, #f87171, #ef4444);
}

.card--mild .card__strip {
  background: linear-gradient(90deg, var(--golf-green-300), var(--golf-green-700));
}

.card--cool .card__strip {
  background: linear-gradient(90deg, #67e8f9, #06b6d4);
}

.card--cold .card__strip {
  background: linear-gradient(90deg, #60a5fa, #2563eb);
}

.card__body {
  padding: 16px;
}

.card__name {
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  margin: 0;
}

.card__region {
  font-size: 11px;
  color: #dcfce7;
  margin: 2px 0 0;
}

.card__icon {
  width: 36px;
  height: 36px;
}

.card__temp-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.card__temp {
  font-size: 30px;
  font-weight: 800;
  color: var(--golf-green-950);
  line-height: 1;
}

.card__temp-unit {
  font-size: 14px;
  color: #64748b;
}

.card__status {
  font-size: 12px;
  color: #64748b;
  margin-left: 6px;
}

.card__stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #475569;
  margin-top: 8px;
}

.card__tip {
  font-size: 11px;
  color: var(--golf-green-700);
  background: var(--golf-green-100);
  border-radius: 8px;
  padding: 6px 8px;
  margin: 10px 0 0;
}

.card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.card__btn {
  width: 100%;
  margin-top: 12px;
}
</style>
