import Api from './api'

export default {
  login(user) {
    return Api().post('/login',
     user, { withCredentials: true })
   },
   signup (user) {
     return Api().post('/signup',
       user, { withCredentials: true })
   }

}
