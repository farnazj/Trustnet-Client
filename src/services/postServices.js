import Api from './api'

export default {
  getBoosts(params, headers) {
    return Api().get('/boosts/?limit=' + params.limit + '&offset=' + params.offset, {
      withCredentials: true,
      headers: headers
    })
  },
  initiatePost(reqBody) {
    return Api().post('/posts',
     reqBody, { withCredentials: true })
  },
  importArticle(reqBody) {
    return Api().post('/posts/import',
    reqBody, { withCredentials: true })
  },
  boostArticle(reqBody) {
    return Api().post('/boosts',
    reqBody, { withCredentials: true })
  },
  getBoostByPostId(params, headers) {
    return Api().get('/boosts/posts/' + params.postId, {
      withCredentials: true,
      headers: headers
    })
  },
  deleteBoostByBoostId(params) {
    return Api().delete('/boosts/' + params.boostId, {
      withCredentials: true
    })
  },
  editPost(params, reqBody) {
    return Api().put('/posts/' + params.postId,
     reqBody, {
       withCredentials: true
     })
  },
  deletePost(params) {
    return Api().delete('/posts/' + params.postId,
    { withCredentials: true })
  },
  getPost(params) {
    return Api().get('/posts/' + params.postId,
    { withCredentials: true })
  },
  getActivity(params, headers) {
    return Api().get('/activity/' + params.username + '?limit=' + params.limit +
     '&offset=' + params.offset, {
      withCredentials: true,
      headers: headers
    })
  },
  getActivityByPostId(params) {
    return Api().get('/activity/' + params.username + '/' + params.postId, {
      withCredentials: true
    })
  },
  changeSeenStatus(params, reqBody) {
    return Api().post('/posts/' + params.postId + '/seen-status',
      reqBody, {
        withCredentials: true
      })
  },
  getSeenStatus(params) {
    return Api().get('/posts/' + params.postId + '/seen-status',
      {
        withCredentials: true
      })
  }

}
