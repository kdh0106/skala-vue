import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// 1. OpenWeatherMap: 실시간 날씨
export async function fetchCurrentWeather(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  return {
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    status: data.weather[0].description,
    icon: data.weather[0].icon,
    windSpeed: data.wind.speed,
  }
}

// 2. OpenWeatherMap 추가 API: 5일치 3시간 간격 예보 → 하루 대표값(정오 근처)만 추려서 5일 예보로 가공
export async function fetchForecast(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  return data.list
    .filter((entry) => entry.dt_txt.includes('12:00:00'))
    .slice(0, 5)
    .map((entry) => ({
      date: entry.dt_txt.slice(0, 10),
      temp: Math.round(entry.main.temp),
      status: entry.weather[0].description,
      icon: entry.weather[0].icon,
    }))
}

// OpenWeatherMap 추가 API: 대기질(미세먼지) — 기존 OpenWeatherMap 키 그대로 재사용
const AQI_LABELS = { 1: '좋음', 2: '보통', 3: '민감군 주의', 4: '나쁨', 5: '매우 나쁨' }

// 환경부 통합대기환경지수 PM2.5 기준 등급 (OpenWeatherMap 자체 aqi 지수와는 별개 산정 기준)
function getPm25Level(pm25) {
  if (pm25 <= 15) return '좋음'
  if (pm25 <= 35) return '보통'
  if (pm25 <= 75) return '나쁨'
  return '매우 나쁨'
}

export async function fetchAirQuality(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  })
  const [entry] = data.list
  const pm25 = Math.round(entry.components.pm2_5)
  const pm10 = Math.round(entry.components.pm10)
  return {
    aqi: entry.main.aqi, // 1~5 (OpenWeatherMap 자체 지수)
    aqiLabel: AQI_LABELS[entry.main.aqi] ?? '알 수 없음',
    pm25,
    pm10,
    pm25Level: getPm25Level(pm25), // 환경부 기준 등급 (추가 정보)
    maskRecommended: pm25 > 35, // 마스크 착용 권장 여부 (추가 정보)
  }
}

// 3. 기타 외부 API: 일몰 시각 → 마지막 티오프 권장 시각(일몰 1시간 전) 계산 (키 없이 쓸 수 있는 무료 API)
export async function fetchSunset(lat, lon) {
  const { data } = await axios.get('https://api.sunrise-sunset.org/json', {
    params: { lat, lng: lon, formatted: 0 },
  })
  const sunset = new Date(data.results.sunset)
  const lastTeeTime = new Date(sunset.getTime() - 60 * 60 * 1000)
  const formatKst = (date) =>
    date.toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
    })
  return {
    sunset: formatKst(sunset),
    lastTeeTime: formatKst(lastTeeTime),
  }
}
