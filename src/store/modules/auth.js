import authServices from '@/services/authServices'

export default {
  namespaced: true,
  state: {

    user: {},
    status: ''
  },
  getters: {

    isLoggedIn: state => state.status == 'success',
    authStatus: state => state.status
  },
  mutations: {

    auth_request(state){
    state.status = 'loading'
    },
    auth_success(state, user){
      state.status = 'success',
      state.user = user
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
    }
  },
  actions: {

    login: (context, user) => {
      return new Promise((resolve, reject) => {
        context.commit('auth_request')
        authServices.login(user)
        .then(resp => {
          const user = resp.data.user
          context.commit('auth_success', user)
          resolve(resp)
        })
        .catch(err => {
          context.commit('auth_error')
          reject(err)
        })
      })
    },

    register: ({commit}, user) => {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        authServices.signUp(user).then(resp => {
          const user = resp.data.user //TODO: change
          commit('auth_success', user)
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error', err)
          reject(err)
        })
      })
    },

    logout: ({commit}) => {
      return new Promise((resolve, reject) => {
        commit('logout')
        resolve()
      })
    }

  }
}
