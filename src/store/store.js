import Vue from 'vue'
import Vuex from 'vuex'
import articleFilters from './modules/articleFilters'
import assessments from './modules/assessments'
import auth from './modules/auth'
import relatedSources from './modules/relatedSources'
import articleDetails from './modules/articleDetails'
import profileArticles from './modules/profileArticles'
import loader from './modules/loader'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {

  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    auth,
    articleFilters,
    relatedSources,
    profileArticles,
    loader
  }
})

store.registerModule('homeArticleDetails', articleDetails);
store.registerModule('profileArticleDetails', articleDetails);

store.registerModule('homeAssessments', assessments);
store.registerModule('profileAssessments', assessments);

export default store;
