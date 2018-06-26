import Vue from 'vue'
import App from '@/components/App'

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: h => h(App)
})

if (__DEV__) {
  Vue.config.devtools = true
  Vue.config.productionTip = false
}

if (__PROD__) {
  Vue.config.devtools = false
}
