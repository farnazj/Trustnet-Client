import Api from './api'

export default {

  getFollows() {
    return Api().get('/follows', {
      withCredentials: true,
    })
  },
  getTrusteds() {
    return Api().get('/trusts', {
      withCredentials: true,
    })
  }

}
