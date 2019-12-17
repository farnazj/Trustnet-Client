import relationServices from '@/services/relationServices'
import utils from '@/services/utils'

export default {
  namespaced: true,
  state: {
    followedSources: [],
    trustedSources: [],
    followers: []
  },
  getters: {
    trustedIds: (state) => {
      return state.trustedSources.map(source => source.id);
    },
    followedIds: (state) => {
      return state.followedSources.map(source => source.id);
    },
    followedOrTrusteds: (state) => {

      let allSources = [];
      for (let key of [state.followedSources, state.trustedSources]) {

        key.forEach(source => {
          let index = allSources.findIndex(el => el.id == source.id);
          if (index == -1) {
            let newSource = Object.assign({}, source);
            allSources.push(newSource);
          }
        })
      }
      return allSources;
    }

  },
  mutations: {

    populate_follows: (state, sources) => {
      sources.sort(utils.compareSources);
      state.followedSources = sources;
    },
    populate_trusteds: (state, sources) => {
      sources.sort(utils.compareSources);
      state.trustedSources = sources;
    },
    populate_followers: (state, sources) => {
      sources.sort(utils.compareSources);
      state.followers = sources;
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
    },

    fetchTrusteds: (context) => {

      return new Promise((resolve, reject) => {

        relationServices.getTrusteds()
        .then(response => {
          context.commit('populate_trusteds', response.data);
          resolve();
        })
      })
    },

    fetchFollowers: (context) => {

      let authUsername = context.rootGetters['auth/user'].userName;

      return new Promise((resolve, reject) => {

        relationServices.getFollowers({username: authUsername})
        .then(response => {
          context.commit('populate_followers', response.data);
          resolve();
        })
      })
    },

    addTrusted: (context, payload) => {

      return new Promise((resolve, reject) => {

        relationServices.addTrusted(payload)
        .then(response => {
          context.dispatch('fetchTrusteds')
          .then(()=> {
            resolve();
          })
        })
        .catch(err => {
          console.log(err)
          reject();
        })
      })
    },

    deleteTrusted: (context, payload) => {

      return new Promise((resolve, reject) => {

        relationServices.deleteTrusted(payload)
        .then(response => {
          context.dispatch('fetchTrusteds')
          .then(() => {
            resolve();
          })
        })
        .catch(err => {
          console.log(err)
          reject();
        })
      })
    },

    follow: (context, payload) => {

      return new Promise((resolve, reject) => {

        relationServices.follow(payload)
        .then(() => {
          context.dispatch('fetchFollows')
          .then(() => {
            resolve()
          })
        })
        .catch(err => {
          console.log(err)
          reject();
        })
      });
    },

    unfollow: (context, payload) => {

      return new Promise((resolve, reject) => {

        relationServices.unfollow(payload)
        .then(() => {
          let dispatchProms = [
            context.dispatch('fetchFollows'),
            context.dispatch('fetchTrusteds')
          ];
          Promise.all(dispatchProms)
          .then(() => {
            resolve();
          })
        })
        .catch(err => {
          console.log(err);
          reject();
        })
      })
    }

  }
}
