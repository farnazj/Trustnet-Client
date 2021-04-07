import authServices from '@/services/authServices'
import sourceServices from '@/services/sourceServices'

export default {
  namespaced: true,
  state: {
    status: '',
    token: JSON.parse(localStorage.getItem('token')) || ''
  },
  getters: {

    isLoggedIn: (state) => {
      return !!state.token;
    },
    authStatus: (state) => {
      return state.status;
    },
    user: (state) => {

      if (Object.entries(state.token).length)
        return state.token;
      else {
        return JSON.parse(localStorage.getItem('token'));
      }
    }
  },
  mutations: {

    auth_request(state){
      state.status = 'loading'
    },

    auth_success(state, user){
      state.status = 'success';
    },

    auth_error(state){
      state.status = 'error';
    },

    logout(state){
      state.status = '';
      state.token = '';
      localStorage.removeItem('token');
    },

    update_user(state, user) {
      localStorage.setItem('token', JSON.stringify(user));
      state.token = Object.assign({}, user);
    }
  },
  actions: {
    updateUser: (context) => {

      return new Promise((resolve, reject) => {
        let id = context.state.token.id;
        sourceServices.getSourceById(id)
        .then(response => {
        let authUser = response.data;
        context.commit('update_user', authUser);
        resolve();
       })
       .catch(err => {
         reject(err);
       })
      })
    },

    login: (context, user) => {

      return new Promise((resolve, reject) => {
        context.commit('auth_request')
        authServices.login(user)
        .then(resp => {
          const user = resp.data.user;
          context.commit('auth_success');
          context.commit('update_user', user);
          context.dispatch('relatedSources/fetchFollows',{}, { root: true });
          context.dispatch('relatedSources/fetchTrusteds',{}, { root: true });
          context.dispatch('relatedSources/fetchFollowers',{}, { root: true });
          context.dispatch('preferences/getUserPreferences', {}, { root: true });

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
