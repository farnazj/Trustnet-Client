import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'
import './assets/css/main.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/store'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios;

Vue.use(Vuetify, {
  iconfont: 'mdi',
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
