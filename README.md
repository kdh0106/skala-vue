# skala-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Troubleshooting

### 화면이 창 너비를 다 못 쓰고 좁게 표시됨

- **증상**: 브라우저 창을 넓혀도 페이지 콘텐츠가 화면 일부(창 폭의 1/4 정도)에만 좁게 표시되고 나머지는 빈 배경으로 남음.
- **원인**: `src/assets/main.css`에 Vite/Vue 기본 스캐폴드가 남겨둔 `#app` 규칙이 원인이었음.
  - `#app { max-width: 1280px; margin: 0 auto; }`로 폭이 고정됨
  - `@media (min-width: 1024px)`에서 `#app { display: grid; grid-template-columns: 1fr 1fr; }`로 2단 그리드가 적용되어, 화면이 넓어질수록 콘텐츠가 그리드의 절반 칸에만 들어감
- **해결**: `main.css`에서 `#app`의 `max-width`, `margin`, 2단 그리드(`display: grid; grid-template-columns: 1fr 1fr;`) 규칙을 제거. 레이아웃 폭 제어는 각 컴포넌트(예: `WeatherMockup.vue`의 `.app`)에서 직접 하도록 함.
