import Api from './api'

export default {

  getSourceById(id) {
    return Api().get('/sources/ids/' + id, {
      withCredentials: true,
    })
  }

}
