import Vue from 'vue'
import Vuex from 'vuex'
import articleFilters from './modules/articleFilters'
import assessments from './modules/assessments'
import auth from './modules/auth'
import relatedSources from './modules/relatedSources'
import articleDetails from './modules/articleDetails'

Vue.use(Vuex)

export default new Vuex.Store({
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
    assessments,
    relatedSources,
    articleDetails
  }
})
