/**
 * @fileoverview wraps API calls to the /assessments or /assessment routes
 * about its dependencies.
 */

import Api from './api'

export default {
  getPostSourceAssessment(sourceId, postId) {
    return Api().get('/posts/' + postId + '/' + sourceId + '/assessment', {
      withCredentials: true
    })
  },
  getAssessmentsForPost(postId) {
    return Api().get('/posts/' + postId + '/assessments', {
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
