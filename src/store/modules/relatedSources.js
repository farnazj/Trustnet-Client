import relationServices from '@/services/relationServices'
import utils from '@/services/utils'

export default {
  namespaced: true,
  state: {
    followed_sources: [],
    trusted_sources: [],
    followers: []
  },
  getters: {
    trustedIds: (state) => {
      return state.trusted_sources.map(source => source.id);
    },
    followedIds: (state) => {
      return state.followed_sources.map(source => source.id);
    }

  },
  mutations: {

    populate_follows: (state, sources) => {
      sources.sort(utils.compareSources);
      state.followed_sources = sources;
    },
    populate_trusteds: (state, sources) => {
      sources.sort(utils.compareSources);
      state.trusted_sources = sources;
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

      return new Promise((resolve, reject) => {
        relationServices.getFollowers()
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
        let relation_proms = [
          relationServices.deleteTrusted(payload),
          relationServices.unfollow(payload)
        ];
        Promise.all(relation_proms)
        .then(() => {
          let dispatch_proms = [
            context.dispatch('fetchFollows'),
            context.dispatch('fetchTrusteds')
          ];
          Promise.all(dispatch_proms)
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
