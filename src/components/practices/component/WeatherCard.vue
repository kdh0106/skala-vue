<script setup>
import { computed } from 'vue'

// 선택된 도시 객체를 부모로부터 전달받아 표시 (props)
const props = defineProps({
  city: { type: Object, required: true },
})

// 카드 선택(select-card), 상세보기 클릭(click-detail)을 부모에 전달 (emits)
defineEmits(['select-card', 'click-detail'])

const tempClass = computed(() => {
  const t = props.city.temp
  if (t <= 18) return 'card--cold'
  if (t <= 25) return 'card--cool'
  if (t <= 30) return 'card--mild'
  return 'card--warm'
})
</script>

<template>
  <li class="card" :class="tempClass" @click="$emit('select-card', city)">
    <div class="card__row">
      <span class="card__name">{{ city.name }}({{ city.status }})</span>
      <button class="card__btn" @click.stop="$emit('click-detail', city.name, city.status)">
        상세보기
      </button>
    </div>
    <p class="card__temp">현재 기온: {{ city.temp }}°C · 습도 {{ city.humidity }}%</p>
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
</template>

<style scoped>
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
</style>
