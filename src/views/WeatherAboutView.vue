<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="page-body">
    <section class="page-hero">
      <h2 class="page-hero__title">⛳ 골프장 웨더 소개</h2>
      <p class="page-hero__desc">
        전국 골프장의 실시간 날씨와 일몰 시각을 보여주는 실습용 가상 대시보드 서비스입니다.
      </p>
    </section>

    <el-card class="panel" shadow="never">
      <template #header>
        <span class="panel__title">✨ 주요 기능</span>
      </template>
      <ul class="feature-list">
        <li>
          <span class="feature-list__icon">🔍</span>
          <div>
            <p class="feature-list__title">골프장 검색 &amp; 정렬</p>
            <p class="feature-list__desc">이름으로 검색하고 온도순으로 정렬해서 확인해요.</p>
          </div>
        </li>
        <li>
          <span class="feature-list__icon">🌤️</span>
          <div>
            <p class="feature-list__title">실시간 날씨 카드</p>
            <p class="feature-list__desc">골프장별 기온·습도·풍속을 카드 형태로 한눈에 확인해요.</p>
          </div>
        </li>
        <li>
          <span class="feature-list__icon">📅</span>
          <div>
            <p class="feature-list__title">상세 관측 정보 &amp; 5일 예보</p>
            <p class="feature-list__desc">골프장별 페이지에서 상세 날씨와 예보를 조회해요.</p>
          </div>
        </li>
        <li>
          <span class="feature-list__icon">🌇</span>
          <div>
            <p class="feature-list__title">마지막 티오프 시간 안내</p>
            <p class="feature-list__desc">일몰 시각 기준으로 라운딩 마감 시간을 알려줘요.</p>
          </div>
        </li>
      </ul>
    </el-card>

    <el-button class="back-btn" round @click="router.push('/')"
      >← 메인 대시보드로 돌아가기</el-button
    >
  </div>
</template>

<style scoped>
.page-body {
  color: #1e293b;
}

.page-hero {
  background: linear-gradient(120deg, var(--golf-green-800), var(--golf-green-500));
  color: #fff;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 16px;
}

.page-hero__title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 6px;
}

.page-hero__desc {
  font-size: 13px;
  color: #dcfce7;
  margin: 0;
}

.panel {
  margin-bottom: 14px;
}

.panel__title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--golf-green-800);
}

.feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-list li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.feature-list__icon {
  font-size: 20px;
}

.feature-list__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--golf-green-950);
  margin: 0;
}

.feature-list__desc {
  font-size: 12px;
  color: #64748b;
  margin: 2px 0 0;
}

.back-btn {
  width: 100%;
  margin-top: 16px;
}
</style>
