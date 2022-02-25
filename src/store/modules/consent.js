import consentServices from '@/services/consentServices'

export default {
  namespaced: true,
  state() {
    return {
        userConsent: null
    }
  },
  mutations: {
    set_consent_status: (state, payload) => {
        state.userConsent = payload;
    }
  },
  actions: {
    getUserConsent: (context) => {
        return new Promise((resolve, reject) => {
            consentServices.getConsentStatus()
            .then( response => {
                context.commit('set_consent_status', response.data.value);
                resolve();
            }).catch(error => {
                reject(error)
            })
        })
      
    },
    setUserConsent: (context, payload) => {
        return new Promise((resolve, reject) => {
            consentServices.postConsentStatus( { consent: payload })
            .then( () => {
                context.commit('set_consent_status', payload);
                resolve();
                
            }).catch(error => {
                reject(error)
            })
        })
      
    }

  }
}
