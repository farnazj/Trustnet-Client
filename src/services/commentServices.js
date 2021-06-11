/**
 * @fileoverview wraps API calls to the /assessments or /assessment routes
 * about its dependencies.
 */

import Api from './api'

export default {
  getCommentsForPost(postId, headers) {
    return Api().get('/comments/posts/' + postId, {
      withCredentials: true,
      headers: headers
    })
  },
  postComment(postId, reqBody) {
    return Api().post('/comments/posts/' + postId,
    reqBody, {
      withCredentials: true
    })
  }
}
