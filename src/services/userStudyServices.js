import Api from './api'

export default {

  getRecentUserStats() {
    return Api().get('/recent-user-stats', {
      withCredentials: true
    })
  }
}