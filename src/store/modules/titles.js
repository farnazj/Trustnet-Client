export default {
  namespaced: true,
  state() {
    return {
      customTitlesVisible: false,
      titles: [],
      postId: null,
      historyVisiblity: false,
      titleHistory: [],
      historyOwner: {}
    }
  },
  mutations: {
    set_post_id: (state, id) => {
      state.postId = id;
    },

    set_titles_visibility: (state, visibility) => {
      state.customTitlesVisible = visibility;
    },

    populate_titles: (state, titles) => {
      state.titles = titles;
    },

    set_history_visibility: (state, visiblity) => {
      state.historyVisiblity  = visiblity;
    },

    populate_title_history: (state, payload) => {

      state.titleHistory= payload.history;
      state.historyOwner = payload.author;
    }
  },
  actions: {
    setPostId: (context, payload) => {
      context.commit('set_post_id', payload);
    },

    setTitlesVisibility: (context, payload) => {
      context.commit('set_titles_visibility', payload);
    },

    populateTitles: (context, payload) => {
      context.commit('populate_titles', payload);
    },

    setHistoryVisibility: (context, payload) => {
      context.commit('set_history_visibility', payload);
    },

    populateTitleHistory: (context, payload) => {
      context.commit('populate_title_history', payload);
    }

  }
}
