import titleServices from '@/services/titleServices'

export default {
  namespaced: true,
  state() {
    return {
      customTitlesVisible: false,
      titles: [], //sorted customTitles
      postId: null,
      standaloneTitleIds: [],
      selectedCustomTitleSetId: null, //used for both endorsers and title history
      titleEndorsersState: {
        endorsersVisibility: false,
      },
      titleHistoryState: {
        historyVisibility: false,
        titleHistory: [],
        historyOwner: {}
      }
    }
  },
  mutations: {
    set_post_title_ids: (state, payload) => {
      state.postId = payload.postId;
      state.standaloneTitleIds = payload.standaloneTitleIds;
    },

    set_title_ids: (state, payload) => {
      state.standaloneTitleIds = payload;
    },

    set_titles_visibility: (state, visibility) => {
      state.customTitlesVisible = visibility;
    },

    populate_titles: (state, titles) => {
      state.titles = titles;
    },

    set_history_visibility: (state, visiblity) => {
      state.titleHistoryState.historyVisibility = visiblity;
    },

    populate_title_history: (state, payload) => {

      state.titleHistoryState.titleHistory= payload.history;
      state.titleHistoryState.historyOwner = payload.author;
    },

    set_endorsers_visibility: (state, payload) => {
      let newObj = state.titleEndorsersState;
      newObj.endorsersVisibility = payload;
      state.titleEndorsersState = Object.assign({}, newObj);
    },

    set_custom_title_set_id: (state, payload) => {
      state.selectedCustomTitleSetId = payload.selectedCustomTitleSetId;
    },
  },
  actions: {
    setPostTitleIds: (context, payload) => {
      context.commit('set_post_title_ids', payload);
    },

    setTitleIds: (context, payload) => {
      context.commit('set_title_ids', payload);
    },

    fetchPostTitles: (context, payload) => {

      return new Promise((resolve, reject) => {

        let customTitleReqHeaders = {};

        if (payload.filtersNamespace == 'profileArticles') {
          let activityUserName = context.rootState['profileArticles'].username;
          
          customTitleReqHeaders = {
            activityusername: activityUserName
          };
        }

        let customTitlesProms = [];
        for (let standaloneTitleId of context.state.standaloneTitleIds) {
          customTitlesProms.push(titleServices.getCustomTitlesOfstandaloneTitle({ 
            standaloneTitleId: standaloneTitleId
           }, customTitleReqHeaders));
        }

        Promise.all(customTitlesProms)
        .then(responses => {
          let standaloneTitles = responses.map(response => response.data).flat().filter(el => Object.keys(el).length);
          context.dispatch(`${payload.filtersNamespace}/updateTitles`, {
            postId: context.state.postId,
            standaloneTitles: standaloneTitles
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
    },

    setEndorsersVisibility: (context, payload) => {
      context.commit('set_endorsers_visibility', payload);
    },

    setCustomTitleSetId: (context, payload) => {
      context.commit('set_custom_title_set_id', payload);
    }

  }
}
