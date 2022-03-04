/**
 * @fileoverview wraps API calls to the /consent
 */

 import Api from './api'

 export default {
   getConsentStatus() {
    return Api().get('/consent', {
        withCredentials: true
    })
   },
   postConsentStatus(reqBody) {
    return Api().post('/consent',
        reqBody, {
        withCredentials: true
    })
   }
 }
 