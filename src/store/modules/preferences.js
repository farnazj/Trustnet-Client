import preferencesServices from '@/services/preferencesServices'

export default {
  namespaced: true,
  state() {
    return {
        /*
            articlePreviewTheme
        */
        userPreferences: {}
    }
  },
  mutations: {
    set_preferences: (state, payload) => {
        // state.userPreferences = Object.assign({}, JSON.parse(payload));
        state.userPreferences = Object.assign({}, payload);
    }
  },
  actions: {
    getUserPreferences: (context) => {
        return new Promise((resolve, reject) => {
            let authUserId = context.rootGetters['auth/user'].id;
            preferencesServices.getPreferences({ authUserId: authUserId })
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
            let newPreferences = Object.assign({}, context.state.userPreferences);
            for (const [key, value] of Object.entries(payload))
                newPreferences[key] = value;

            preferencesServices.setPreferences({ 
                authUserId: authUserId 
            }, { preferences: JSON.stringify(newPreferences)})
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
