import assessmentServices from '@/services/assessmentServices'

export default {
  namespaced: true,
  state() {
    return {
      drawerVisible: false,
      article: {},
      assessment: {},
      boosterListVisible: false,
      boosters: [],
      customTitlesVisible: false,
      titles: []
    }
  },
  getters: {

  },
  mutations: {
    set_drawer_visibility: (state, visiblity) => {
      state.drawerVisible = visiblity;
    },

    populate_drawer: (state, article) => {
      state.article = article;
    },

    set_assessment: (state, assessment) => {
      state.assessment = assessment;
    },

    update_article: (state, article) => {
      for (let key of ['body', 'description', 'title', 'url', 'version'])
        state.article[key] = article[key];
    },

    set_boosters_visibility: (state, visiblity) => {
      state.boosterListVisible = visiblity;
    },

    populate_boosters: (state, boosters) => {
      state.boosters = boosters;
    }
  },
  actions: {
    populateArticle: (context, payload) => {
      context.commit('populate_drawer', payload);
    },

    showArticleDrawer: (context, payload) => {
      context.commit('populate_drawer', payload);
      context.commit('set_drawer_visibility', true);
    },

    hideDrawer: (context) => {
      context.commit('set_drawer_visibility', false);
    },

    setDrawerVisibility: (context, payload) => {
      context.commit('set_drawer_visibility', payload);
    },

    getAuthUserPostAssessment: (context) => {

      let authUserId = context.rootGetters['auth/user'].id;

      return new Promise((resolve, reject) => {
        assessmentServices.getPostSourceAssessment(authUserId, context.state.article.id)
        .then(response => {
          let assessment = response.data.length ? response.data[0] : {};
          context.commit('set_assessment', assessment);
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    postAuthUserAssessment: (context, payload) => {

      return new Promise((resolve, reject) => {
        assessmentServices.postAssessment(context.state.article.id, payload)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    updateDisplayedArticle: (context, payload) => {

      let articles = context.rootState[payload.namespace].articles;
      let updatedArticle = articles.find(el => el.id == context.state.article.id);
      context.commit('update_article', updatedArticle);
    },

    setBoostersVisibility: (context, payload) => {
      context.commit('set_boosters_visibility', payload);
    },

    populateBoosters: (context, payload) => {
      context.commit('populate_boosters', payload);
    }

  }
}
