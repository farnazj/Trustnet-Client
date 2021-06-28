import Api from './api'

export default {
    getPreferences() {
        return Api().get(`/preferences`, {
          withCredentials: true
        })
    },
    setPreferences(reqBody) {
        return Api().post(`/preferences`,
          reqBody, {
            withCredentials: true
        })
    }
}