<script setup>
defineProps({
  searchQuery: { type: String, default: '' },
})

// 부모로부터 받은 반응형 데이터를 표시하고(props), 입력이 바뀌면 update-query 이벤트로 부모에 전달(emits)
defineEmits(['update-query'])
</script>

<template>
  <el-input
    :model-value="searchQuery"
    placeholder="검색할 골프장 이름 입력"
    clearable
    @input="$emit('update-query', $event)"
    @clear="$emit('update-query', '')"
  >
    <template #prefix>🔍</template>
  </el-input>
</template>
