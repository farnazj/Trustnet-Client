import Api from './api'

export default {
  
  hasUserEndorsedTitle(params) {
    return Api().get('/custom-title-endorsement/user/' + params.setId,
    {
      withCredentials: true
    })
  },
  setEndorsementStatus(params, reqBody) {
    return Api().post('/custom-title-endorsement/user/' + params.setId,
    reqBody, {
      withCredentials: true
    })
  },
  getTitleEndorsers(params, headers) {
    return Api().get('/custom-title-endorsement/' + params.setId,
    {
      withCredentials: true,
      headers: headers
    })
  },
  /*
  req.body includes: postId, postUrl, customTitleText, pageIndentifiedTitle, appRequest
  */
  postCustomTitle(reqBody) {
    return Api().post('/custom-titles/',
      reqBody, {
        withCredentials: true
      })
  },
  editCustomTitle(params, reqBody) {    
    return Api().post(`custom-titles/${params.setId}`,
      reqBody, {
        withCredentials: true
      })
  },
  deleteCustomTitle(params) {
    return Api().delete(`/custom-titles/${params.setId}`,
    { withCredentials: true })
  },
  getCustomTitlesOfstandaloneTitle(params, headers) {
    return Api().get(`/custom-titles/original-title/${params.standaloneTitleId}`,
    {
      withCredentials: true,
      headers: headers
    })
  },
}
