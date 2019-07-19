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
    return Api().get('/boosts/' + params.postId, {
      withCredentials: true,
      headers: headers
    })
  },
  editPost(params, reqBody) {
    return Api().put('/posts/' + params.postId,
     reqBody, { withCredentials: true })
  },
  deletePost(params) {
    return Api().delete('/posts/' + params.postId,
    { withCredentials: true })
  },
  getPost(params) {
    return Api().get('/posts/' + params.postId,
    { withCredentials: true })
  },
  getActivity(params) {
    return Api().get('/activity/' + params.username + '?limit=' + params.limit +
     '&offset=' + params.offset, {
      withCredentials: true
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
  },
  getCustomTitles(params) {
    return Api().get('/posts/' + params.postId + '/custom-titles',
    {
      withCredentials: true
    })
  },
  postCustomTitle(params, reqBody) {
    return Api().post('/posts/' + params.postId + '/custom-titles',
      reqBody, {
        withCredentials: true
      })
  },
  editCustomTitle(params, reqBody) {
    return Api().post('/posts/' + params.postId + '/custom-titles/' + params.setId,
      reqBody, {
        withCredentials: true
      })
  },
  deleteCustomTitle(params,) {
    return Api().delete('/posts/' + params.postId + '/custom-titles/' + params.setId,
    { withCredentials: true })
  },
  hasUserEndorsedTitle(params) {
    return Api().get('/posts/' + params.setId + '/is-custom-title-endorsed',
    {
      withCredentials: true
    })
  },
  getTitleEndorsers(params) {
    return Api().get('/posts/' + params.setId + '/custom-title-endorsers',
    {
      withCredentials: true
    })
  }

}
