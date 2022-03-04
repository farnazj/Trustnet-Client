import Api from './api'

export default {
    finishStudySignup(params) {
        return Api().post(`/finish-user-study-signup/${params.token}`, {}, {
            withCredentials: true
        })
    },
    logUserInteraction(reqBody) {
        return Api().post('/log-interaction', reqBody, {
            withCredentials: true
        })
    }

}