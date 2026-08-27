<script setup>
defineProps({
  searchQuery: { type: String, default: '' },
})

// 부모로부터 받은 반응형 데이터를 표시하고(props), 입력이 바뀌면 update-query 이벤트로 부모에 전달(emits)
defineEmits(['update-query'])
</script>

<template>
  <div class="search-wrap">
    <span class="search-wrap__icon">🔍</span>
    <input
      class="search"
      type="text"
      placeholder="검색할 도시 이름 입력"
      :value="searchQuery"
      @input="$emit('update-query', $event.target.value)"
    />
  </div>
</template>

<style scoped>
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
</style>
