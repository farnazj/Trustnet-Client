import Api from './api'

export default {
    getNotifications(params) {
        return Api().get('/notifications/?limit=' + params.limit + '&offset=' + params.offset, {
          withCredentials: true
        })
    },
    changeSeenStatus(params, reqBody) {
        return Api().post('/notifications/' + params.notifId + '/seen-status',
          reqBody, {
            withCredentials: true
        })
    },
    clickOnNotifation(params) {
        return Api().post('/notifications/' + params.notifId + '/clicked', {}, {
          withCredentials: true
      })
    }
}
