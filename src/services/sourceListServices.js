import Api from './api'
import utils from './utils'

export default {

  getLists(params) {
    return Api().get('/lists' + utils.addLimitOffsetToQuery(params), {
      withCredentials: true
    })
  },
  addList(reqBody) {
    return Api().post('/lists',
      reqBody, {
        withCredentials: true
      })
  },
  getListSources(params) {
    return Api().get('/lists/' + params.listId + utils.addLimitOffsetToQuery(params),
    { withCredentials: true })
  },
  updateList(params, reqBody) {
    return Api().put('/lists/' + params.listId,
     reqBody, {
       withCredentials: true
     })
  },
  deleteList(params) {
    return Api().delete('/lists/' + params.listId,
    { withCredentials: true })
  },
  addSourceToList(params, reqBody) {
    return Api().post('/lists/' + params.listId + '/add-source/',
      reqBody, {
        withCredentials: true
      })
  },
  removeSourceFromList(params, reqBody) {
    return Api().post('/lists/' + params.listId + '/remove-source/',
      reqBody, {
        withCredentials: true
      })
  },
}
