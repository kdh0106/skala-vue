<script setup>
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <el-tag round effect="plain">
      날씨단위: {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}({{ configStore.unitSymbol }})
    </el-tag>
    <el-button size="small" round type="primary" @click="configStore.toggleUnit">
      단위변경
    </el-button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
