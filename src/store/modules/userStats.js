import userStudyServices from '@/services/userStudyServices'
import utils from '@/services/utils'

export default {
    namespaced: true,
    state() {
        return {
            statsSheetVisible: false,
            recentShareCount: null,
            recentAssessmentCount: null
        }
  },
  mutations: {

    populate_stats: (state, payload) => {
        if (payload.shareCount)
            state.recentShareCount = payload.shareCount;
        if (payload.assessmentCount)
            state.recentAssessmentCount = payload.assessmentCount;
    },
    set_sheet_visibility: (state, visiblity) => {
        state.statsSheetVisible = visiblity;
    }
  
  },
  actions: {
        populateStats: (context) => {
            return new Promise((resolve, reject) => {
                userStudyServices.getRecentUserStats()
                .then( results => {
                    context.commit('populate_stats', {
                        shareCount: results.data.recentBoostCount,
                        assessmentCount: results.data.recentAssessmentCount
                    });
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })
            })
        },
        incrementShareCount: (context) => {
            return new Promise((resolve, reject) => {
                context.commit('populate_stats', { 
                    shareCount: context.state.recentShareCount + 1,
                    assessmentCount: null
                    })
                resolve();
            })
        },
        incrementAssessmentCount: (context) => {
            return new Promise((resolve, reject) => {
                context.commit('populate_stats', { 
                    assessmentCount: context.state.recentAssessmentCount + 1,
                    shareCount: null
                    })
                resolve();
            })
        },
        setStatsSheetVisibility: (context, payload) => {
            return new Promise((resolve, reject) => {
                context.commit('set_sheet_visibility', payload);
                resolve();
            })
        },
        planWhenToShow: (context) => {
            let statsDelay = utils.getRandomInt(240, 360) * 1000;

            return new Promise((resolve, reject) => {
                context.dispatch('populateStats')
                .then(() => {
                    window.setTimeout(() => {
                        context.dispatch('setStatsSheetVisibility', true)
                    }, statsDelay)
                    resolve();
                })
                .catch(err => {
                    reject(err);
                })
            })
            
        }
  }

}