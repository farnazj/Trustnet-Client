import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'

import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import './plugins/vuetify'
import App from './App.vue'
//import VueResource from 'vue-resource'
import router from './router'
import store from './store/store'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios;
//Vue.use(VueResource);

Vue.use(Vuetify, {
  iconfont: 'fa'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
