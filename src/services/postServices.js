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
    reqBody, { withCredentials: true})
  }

}
