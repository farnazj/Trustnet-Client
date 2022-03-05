import Api from './api'

export default {
    finishStudySignup(params, reqBody) {
        return Api().post(`/finish-user-study-signup/${params.token}`, reqBody, {
            withCredentials: true
        })
    },
    logUserInteraction(reqBody) {
        return Api().post('/log-interaction', reqBody, {
            withCredentials: true
        })
    }

}