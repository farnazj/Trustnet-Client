import axios from 'axios'
import store from '../store/store'
import router from '../router'

//&& err.config && !err.config.__isRetryRequest
const instance = axios.create({
    baseURL: `http://localhost:3000`,
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
