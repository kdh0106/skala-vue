import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    unit: 'celsius', // 'celsius' | 'fahrenheit'
    windUnit: 'ms', // 본인 추가 state: 'ms' | 'mph'
  }),
  getters: {
    unitSymbol: (state) => (state.unit === 'fahrenheit' ? '°F' : '°C'),
    // 본인 추가 getter
    windUnitSymbol: (state) => (state.windUnit === 'mph' ? 'mph' : 'm/s'),
  },
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
    // 본인 추가 action
    toggleWindUnit() {
      this.windUnit = this.windUnit === 'ms' ? 'mph' : 'ms'
    },
  },
})
