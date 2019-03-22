import Api from './api'

export default {
  getSources(params, headers) {
    return Api().get('/sources/?limit=' + params.limit + '&offset=' + params.offset, {
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
  }

}
