import assessmentServices from '@/services/assessmentServices'

export default {
  namespaced: true,
  state() {
    return {
      drawerVisible: false,
      article: {},
      assessment: {}
    }
  },
  getters: {

  },
  mutations: {
    set_drawer_visibility: (state, visiblity) => { state.drawerVisible = visiblity; },

    populate_drawer: (state, article) => {
      state.article = article;
    },

    set_assessment: (state, assessment) => {
      state.assessment = assessment;
    },

    update_article: (state, article) => {
      for (let key of ['body', 'description', 'title', 'url', 'version'])
        state.article[key] = article[key];
    }
  },
  actions: {
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
      let auth_userid = context.rootGetters['auth/user'].id;

      return new Promise((resolve, reject) => {
        assessmentServices.getPostSourceAssessment(auth_userid, context.state.article.id)
        .then(response => {
          context.commit('set_assessment', response.data);
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
          context.dispatch('getAuthUserPostAssessment')
          .then(response => {
            resolve();
          })
        })
        .catch(err => {
          reject(err);
        })
      })
    },

    updateDisplayedArticle: (context) => {
      let articles = context.rootState.articleFilters.articles;
      let updated_article = articles.find(el => el.id == context.state.article.id);
      context.commit('update_article', updated_article);
    }

  }
}
