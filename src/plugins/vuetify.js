import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#C0CA33',
      }
    }
  },
  icons: {
    iconfont: 'mdi',
  }
});
