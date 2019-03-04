import Api from './api'

export default {
  getPostSourceAssessment(sourceId, postId) {
    return Api().get('/posts/' + postId + '/' + sourceId + '/assessment', {
      withCredentials: true
    })
  }
}
