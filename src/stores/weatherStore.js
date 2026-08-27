import { defineStore } from 'pinia'
import { cityList } from '../mocks/cityList'
import { fetchCurrentWeather, fetchForecast, fetchSunset } from '../services/weatherApi'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    cities: cityList,
    currentByCityId: {}, // { [cityId]: { temp, humidity, status, icon, windSpeed } }
    forecastByCityId: {}, // { [cityId]: [{ date, temp, status, icon }, ...] }
    sunsetByCityId: {}, // { [cityId]: { sunset, lastTeeTime } } — 기타 외부 API(일몰)
    loading: false,
    error: null,
  }),
  getters: {
    // Home 화면에서 쓰는, 정적 도시 정보 + 실시간 날씨가 합쳐진 목록 (아직 안 받아온 도시는 제외)
    citiesWithWeather: (state) =>
      state.cities
        .filter((city) => state.currentByCityId[city.id])
        .map((city) => ({ ...city, ...state.currentByCityId[city.id] })),
  },
  actions: {
    getCityById(cityId) {
      return this.cities.find((city) => city.id === cityId)
    },
    async fetchAllCurrent() {
      this.loading = true
      this.error = null
      try {
        const results = await Promise.all(
          this.cities.map((city) => fetchCurrentWeather(city.lat, city.lon)),
        )
        this.cities.forEach((city, index) => {
          this.currentByCityId[city.id] = results[index]
        })
      } catch (err) {
        this.error = 'OpenWeatherMap에서 날씨를 불러오지 못했습니다. API 키를 확인해주세요.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async fetchCurrentWeatherFor(cityId) {
      if (this.currentByCityId[cityId]) return this.currentByCityId[cityId]
      const city = this.getCityById(cityId)
      if (!city) return null
      try {
        this.currentByCityId[cityId] = await fetchCurrentWeather(city.lat, city.lon)
      } catch (err) {
        this.error = 'OpenWeatherMap에서 날씨를 불러오지 못했습니다. API 키를 확인해주세요.'
        console.error(err)
      }
      return this.currentByCityId[cityId] ?? null
    },
    async fetchForecastFor(cityId) {
      if (this.forecastByCityId[cityId]) return this.forecastByCityId[cityId]
      const city = this.getCityById(cityId)
      if (!city) return null
      try {
        this.forecastByCityId[cityId] = await fetchForecast(city.lat, city.lon)
      } catch (err) {
        this.error = '5일 예보를 불러오지 못했습니다. API 키를 확인해주세요.'
        console.error(err)
      }
      return this.forecastByCityId[cityId] ?? null
    },
    async fetchSunsetFor(cityId) {
      if (this.sunsetByCityId[cityId]) return this.sunsetByCityId[cityId]
      const city = this.getCityById(cityId)
      if (!city) return null
      try {
        this.sunsetByCityId[cityId] = await fetchSunset(city.lat, city.lon)
      } catch (err) {
        console.error(err)
      }
      return this.sunsetByCityId[cityId] ?? null
    },
  },
})
