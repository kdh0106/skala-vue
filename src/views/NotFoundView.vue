<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="lost">
    <div class="icon">⛳🕳️</div>
    <p class="title">아이고, OB(Out of Bounds)입니다!</p>
    <p class="desc">요청하신 페이지를 찾을 수 없어요. 주소가 존재하지 않거나 삭제되었습니다.</p>
    <el-button type="primary" round @click="router.push('/')">⛳ 대시보드로 돌아가기</el-button>
  </div>
</template>

<style scoped>
.lost {
  text-align: center;
  background: linear-gradient(120deg, var(--golf-green-800), var(--golf-green-500));
  color: #fff;
  border-radius: 18px;
  padding: 56px 40px;
}

.icon {
  font-size: 44px;
  margin-bottom: 12px;
}

.title {
  font-size: 17px;
  font-weight: 800;
  margin: 0 0 8px;
}

.desc {
  font-size: 13px;
  color: #dcfce7;
  margin: 0 0 20px;
}
</style>
