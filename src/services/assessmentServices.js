import Api from './api'

export default {
  getPostSourceAssessment(sourceId, postId) {
    return Api().get('/posts/' + postId + '/' + sourceId + '/assessment', {
      withCredentials: true
    })
  },
  postAssessment(postId, reqBody) {
    return Api().post('/posts/' + postId + '/assessments',
    reqBody, {
      withCredentials: true
    })
  }
}
