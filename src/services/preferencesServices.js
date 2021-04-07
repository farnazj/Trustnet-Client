import Api from './api'

export default {
    getPreferences(params) {
        return Api().get(`/preferences/${params.authUserId}`, {
          withCredentials: true
        })
    },
    setPreferences(params, reqBody) {
        return Api().post(`/preferences/${params.authUserId}`,
          reqBody, {
            withCredentials: true
        })
    }
}