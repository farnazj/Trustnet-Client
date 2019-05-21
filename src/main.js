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
import VueObserveVisibility from 'vue-observe-visibility'

Vue.config.productionTip = false
Vue.prototype.$http = axios;

Vue.use(Vuetify, {
  iconfont: 'mdi',
})
Vue.use(VueObserveVisibility);

new Vue({
  router,
  store,
  render: h => h(App),
  created: function() {
   window.fbAsyncInit = function() {
     FB.init({
       appId      : '1910706082368253',
       xfbml      : true,
       version    : 'v2.7'
     });

    //  FB.getLoginStatus(function(response) {
    //    console.log(response);
    // });

  };

   (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
 }
}).$mount('#app')
