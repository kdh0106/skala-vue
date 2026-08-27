<script setup>
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-toggler__label">
      날씨단위: {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}({{ configStore.unitSymbol }})
    </span>
    <button class="unit-toggler__btn" @click="configStore.toggleUnit">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  padding: 6px 6px 6px 14px;
}

.unit-toggler__label {
  font-size: 12px;
  color: #4338ca;
  font-weight: 600;
}

.unit-toggler__btn {
  border: none;
  background: #4338ca;
  color: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
</style>
