/**
 * @fileoverview wraps API calls to the /assessments or /assessment routes
 * about its dependencies.
 */

import Api from './api'

export default {
  getCommentsForPost(params) {
    // console.log("getCommentsForPost")
    return Api().get('/comments/posts/' + params.postId + `?limit=${params.limit}&offset=${params.offset}`, {
      withCredentials: true,
    })
  },
  getReplyComments(params) {
    // console.log("getCommentsForPost")
    return Api().get(`/comments/trees/${params.postId}/${params.rootSetId}?limit=${params.limit}&offset=${params.offset}`, {
      withCredentials: true,
    })
  },
  postComment(postId, reqBody) {
    // console.log("postComment")
    return Api().post('/comments/posts/' + postId,
    reqBody, {
      withCredentials: true
    })
  },
  getCommentHistory(setId) {
    return Api().get('/comments/sets/' + setId, {
      withCredentials: true
    })
  },
  editComment(setId, reqBody) {
    // console.log("editComment")
    return Api().post('/comments/sets/' + setId,
    reqBody, {
      withCredentials: true
    })
  },
  // replyToComment(postId, reqBody) {
  //   // console.log("replyToComment")
  //   return Api().post('/comments/sets/' + postId,
  //   reqBody, {
  //     withCredentials: true
  //   })
  // },
  deleteComment(setId) {
    // console.log("deleteComment")
    return Api().delete('/comments/sets/' + setId, {
      withCredentials: true
    })
  }
}
