import Api from './api'

export default {
  login(user) {
    return Api().post('/login',
     user, { withCredentials: true })
   },
   signup (user) {
     return Api().post('/signup',
       user, { withCredentials: true })
   },
   logout() {
     return Api().post('/logout', {}, {
       withCredentials: true
     })
   },
   forgotPassword(reqBody) {
     return Api().post('/forgot-password', reqBody)
   },
   resetPassword(params, reqBody) {
     return Api().post('/reset-password/' + params.token,
      reqBody);
   }

}
