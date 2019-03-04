export default {
  namespaced: true,
  state: {
    drawerVisible: false,
    article: {}
  },
  getters: {

  },
  mutations: {
    set_drawer_visibility: (state, visiblity) => { state.drawerVisible = visiblity; },

    populate_drawer: (state, article) => {
      state.article = article;
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
    }
  }
}
