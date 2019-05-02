import Api from './api'

export default {
  getPostSourceAssessment(sourceId, postId) {
    return Api().get('/posts/' + postId + '/' + sourceId + '/assessment', {
      withCredentials: true
    })
  },
  getAssessmentsForPost(postId, headers) {
    return Api().get('/posts/' + postId + '/assessments', {
      withCredentials: true,
      headers: headers
    })
  },
  postAssessment(postId, reqBody) {
    return Api().post('/posts/' + postId + '/assessments',
    reqBody, {
      withCredentials: true
    })
  }
}
