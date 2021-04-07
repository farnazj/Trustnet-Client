import preferencesServices from '@/services/preferencesServices'

export default {
  namespaced: true,
  state() {
    return {
        /*
            articlePreviewTheme
        */
        preferences: {}
    }
  },
  mutations: {
    set_preferences: (state, payload) => {
        state.preferences = Object.assign({}, JSON.parse(payload));
    }
  },
  actions: {
    getUserPreferences: (context) => {
        return new Promise((resolve, reject) => {
            let authUserId = context.rootGetters['auth/user'].id;
            preferencesServices.getUserPreferences({ authUserId: authUserId })
            .then( response => {
                context.commit('set_preferences', response.data);
                resolve();
            }).catch(error => {
                reject(error)
            })
        })
      
    },
    setUserPreferences: (context, payload) => {
        return new Promise((resolve, reject) => {
            let authUserId = context.rootGetters['auth/user'].id;
            preferencesServices.setUserPreferences({ 
                authUserId: authUserId 
            }, JSON.stringify(payload))
            .then( () => {
                context.dispatch('getUserPreferences')
                .then(() => {
                    resolve();
                }) 
            }).catch(error => {
                reject(error)
            })
        })
      
    }

  }
}
