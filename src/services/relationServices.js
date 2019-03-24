import Api from './api'

export default {

  getFollows() {
    return Api().get('/follows', {
      withCredentials: true
    })
  },
  follow(reqBody) {
    return Api().post('/follows',
    reqBody, {
      withCredentials: true
    })
  },
  unfollow(reqBody) {
    return Api().delete('/follows',
    {
      data: reqBody,
      withCredentials: true
    })
  },
  getTrusteds() {
    return Api().get('/trusts', {
      withCredentials: true
    })
  },
  addTrusted(reqBody) {
    return Api().post('/trusts',
    reqBody, {
      withCredentials: true
    })
  },
  deleteTrusted(reqBody) {
    return Api().delete('/trusts',
    {
      data: reqBody,
      withCredentials: true
    })
  },
  getFollowers(params) {
    return Api().get('/followers/' + params.username, {
      withCredentials: true
    })
  }

}
