import Api from './api'

export default {
  postFeed(reqBody) {
    return Api().post('/feeds',
    reqBody, { withCredentials: true })
  }
}
