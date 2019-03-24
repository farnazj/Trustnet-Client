import authServices from '@/services/authServices'

export default {
  namespaced: true,
  state: {
    status: '',
    token: JSON.parse(localStorage.getItem('token')) || {}
  },
  getters: {

    isLoggedIn: (state) => { return !!state.token; },
    authStatus: (state) => { return state.status; },
    user: (state) => {
      if (Object.entries(state.token).length)
        return state.token.id;
      else {
        let user = JSON.parse(localStorage.getItem('token'));
        if (!user)
          return null;
        return JSON.parse(localStorage.getItem('token')).id;
      }
    }
  },
  mutations: {

    auth_request(state){
    state.status = 'loading'
    },
    auth_success(state, user){
      state.status = 'success';
      localStorage.setItem('token', JSON.stringify(user));
      state.token = Object.assign({}, user);
    },
    auth_error(state){
      state.status = 'error';
    },
    logout(state){
      state.status = '';
      state.token = '';
      localStorage.removeItem('token');
    }
  },
  actions: {

    login: (context, user) => {
      return new Promise((resolve, reject) => {
        context.commit('auth_request')
        authServices.login(user)
        .then(resp => {
          const user = resp.data.user;
          context.commit('auth_success', user);
          resolve(resp);
        })
        .catch(err => {
          context.commit('auth_error');
          reject(err);
        })
      })
    },

    signup: ({commit}, user) => {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        authServices.signup(user).then(resp => {
          //const user = resp.data.user
          //commit('auth_success', user);
          resolve(resp);
        })
        .catch(err => {
          commit('auth_error', err)
          reject(err);
        })
      })
    },

    logout: ({commit}) => {
      console.log('going to logout')
      return new Promise((resolve, reject) => {
        authServices.logout().then(resp => {
          commit('logout');
          resolve();
        })
        .catch(err => {
          reject(err);
        })
      })
    }

  }
}
