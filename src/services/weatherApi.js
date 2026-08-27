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
