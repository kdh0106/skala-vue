// Weather Axios 실습: 실제 골프장 위치 목록 (좌표는 실제 클럽하우스 GPS까지는 아니고 소재 지역 기준 근사치)
// temp/humidity 등은 더 이상 여기 없음 — weatherStore가 API로 채움
export const cityList = [
  { id: 'city_01', name: '스카이72 골프클럽', region: '인천 영종도', lat: 37.4483, lon: 126.4547 },
  { id: 'city_02', name: '레이크사이드CC', region: '경기 용인시', lat: 37.2411, lon: 127.1776 },
  { id: 'city_03', name: '아시아드CC', region: '부산 기장군', lat: 35.2438, lon: 129.2145 },
  { id: 'city_04', name: '대전CC', region: '대전 유성구', lat: 36.3707, lon: 127.4419 },
  { id: 'city_05', name: '무등산CC', region: '광주 동구', lat: 35.1907, lon: 126.9611 },
  { id: 'city_06', name: '오라CC', region: '제주 제주시', lat: 33.4611, lon: 126.5297 },
]
