import titleServices from '@/services/titleServices'

export default {
  namespaced: true,
  state() {
    return {
      customTitlesVisible: false,
      titles: [], //sorted customTitles
      postId: null,
      standaloneTitleId: null,
      historyVisiblity: false,
      titleHistory: [],
      historyOwner: {}
    }
  },
  mutations: {
    set_post_title_id: (state, payload) => {
      state.postId = payload.postId;
      state.standaloneTitleId = payload.standaloneTitleId;
    },

    set_title_id: (state, payload) => {
      state.standaloneTitleId = payload;
    },

    set_titles_visibility: (state, visibility) => {
      state.customTitlesVisible = visibility;
    },

    populate_titles: (state, titles) => {
      state.titles = titles;
    },

    set_history_visibility: (state, visiblity) => {
      state.historyVisiblity = visiblity;
    },

    populate_title_history: (state, payload) => {

      state.titleHistory= payload.history;
      state.historyOwner = payload.author;
    }
  },
  actions: {
    setPostTitleId: (context, payload) => {
      context.commit('set_post_title_id', payload);
    },

    setTitleId: (context, payload) => {
      context.commit('set_title_id', payload);
    },

    fetchPostTitles: (context, payload) => {

      return new Promise((resolve, reject) => {

        let customTitleReqHeaders = {};

        if (payload.titlesNamespace == 'profileTitles') {
          let activityUserName = context.rootState['profileArticles'].username;
          
          customTitleReqHeaders = {
            activityusername: activityUserName
          };
        }

        titleServices.getCustomTitlesOfstandaloneTitle({ 
          standaloneTitleId: context.state.standaloneTitleId }, customTitleReqHeaders)
        .then(response => {
          context.dispatch(`${payload.filtersNamespace}/updateTitles`, {
            postId: context.state.postId,
            standaloneTitle: response.data
          }, { root: true });
          resolve();
        })
      })
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
