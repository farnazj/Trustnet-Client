import Api from './api'

export default {
  getSources(params, headers) {
    return Api().get('/sources/?limit=' + params.limit + '&offset=' + params.offset, {
      withCredentials: true,
      headers: headers
    })
  },
  getSourceById(id) {
    return Api().get('/sources/ids/' + id, {
      withCredentials: true
    })
  },
  getSourceByUsername(username) {
    return Api().get('/sources/' + username, {
      withCredentials: true
    })
  },
  updateSource(reqBody) {
    return Api().put('/sources',
     reqBody, { withCredentials: true }
    )
  }

}
