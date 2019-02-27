import relationServices from '@/services/relationServices'
import utils from '@/services/utils'

export default {
  namespaced: true,
  state: {
    followed_sources: [],
    trusted_sources: []
  },
  getters: {

  },
  mutations: {

    populate_follows: (state, sources) => {
      sources.sort(utils.compareSources);
      state.followed_sources = sources;
    }

  },
  actions: {
    fetchFollows: (context) => {

      return new Promise((resolve, reject) => {
        relationServices.getFollows()
        .then(response => {
          context.commit('populate_follows', response.data);
          resolve();
        })
      })

    }
  }
}
