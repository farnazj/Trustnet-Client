import Vue from 'vue'
import Vuex from 'vuex'
import articleFilters from './modules/articleFilters'
import assessments from './modules/assessments'
import titles from './modules/titles'
import auth from './modules/auth'
import relatedSources from './modules/relatedSources'
import articleDetails from './modules/articleDetails'
import profileArticles from './modules/profileArticles'
import preferences from './modules/preferences'
import loader from './modules/loader'
import sourceLists from './modules/sourceLists'
import consent from './modules/consent'

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
    articleFilters, //articles on the homepage
    relatedSources,
    profileArticles, //articles on a profile
    loader,
    sourceLists,
    preferences,
    consent
  }
})

store.registerModule('homeArticleDetails', articleDetails);
store.registerModule('profileArticleDetails', articleDetails);
store.registerModule('singleArticleDetails', articleDetails);

store.registerModule('homeAssessments', assessments);
store.registerModule('profileAssessments', assessments);
store.registerModule('singleArticleAssessments', assessments);

store.registerModule('homeTitles', titles);
store.registerModule('profileTitles', titles);
store.registerModule('singleArticleTitles', titles);

export default store;
