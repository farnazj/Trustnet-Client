import Vue from 'vue'
import Vuex from 'vuex'
import articleFilters from './modules/articleFilters'
import assessments from './modules/assessments'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

    //articles: [],
    //show_assessment_box: false,
    //asssessments
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
    assessments
  }
})
