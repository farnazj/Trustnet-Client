import axios from 'axios'
import store from '../store/store'
import router from '../router'
import consts from './constants'

//&& err.config && !err.config.__isRetryRequest
const instance = axios.create({
    baseURL: consts.BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

instance.interceptors.response.use(undefined, function (err) {
  return new Promise(function (resolve, reject) {
    if (err.response.status === 401 ) {
      store.dispatch('auth/logout')
      .finally(() => {
        router.push('/login');
      })
    }
    throw err;
  });
});


export default() => {
  return instance;
}
