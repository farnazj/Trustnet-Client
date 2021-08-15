/**
 * @fileoverview wraps API calls to the /assessments or /assessment routes
 * about its dependencies.
 */

import Api from './api'

export default {
  getCommentsForPost(postId, headers) {
    console.log("getCommentsForPost")
    return Api().get('/comments/posts/' + postId, {
      withCredentials: true,
      headers: headers
    })
  },
  postComment(postId, reqBody) {
    console.log("postComment")
    return Api().post('/comments/posts/' + postId,
    reqBody, {
      withCredentials: true
    })
  }, // edit + reply + delete
  editComment(setId, reqBody) {
    console.log("editComment")
    return Api().post('/comments/sets/' + setId,
    reqBody, {
      withCredentials: true
    })
  },
  replyToComment(postId, reqBody) {
    console.log("replyToComment")
    return Api().post('/comments/sets/' + postId,
    reqBody, {
      withCredentials: true
    })
  },
  deleteComment(setId) {
    console.log("deleteComment")
    return Api().delete('/comments/sets/' + setId, {
      withCredentials: true
    })
  }
}
