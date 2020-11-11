import userStudyServices from '@/services/userStudyServices'
import utils from '@/services/utils'

export default {
    namespaced: true,
    state() {
        return {
            statsSheetVisible: false,
            recentShareCount: null,
            recentAssessmentCount: null,
            shareGoalPerDay: 2
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
        planWhenToShow: (context, payload) => {

            return new Promise((resolve, reject) => {
           
                window.setTimeout(() => {
                    context.dispatch('populateStats')
                    .then(() => {
                        //console.log('populated', context.state.recentShareCount )
                        if (context.state.recentShareCount < context.state.shareGoalPerDay)
                            context.dispatch('setStatsSheetVisibility', true);
                        
                        let nextDelay = utils.getRandomInt(2 * 60 * 60, 3 * 60 * 60) * 1000;
                        //let nextDelay = utils.getRandomInt(1, 3) * 60 * 1000;
                        context.dispatch('planWhenToShow', nextDelay);
                    })
                    .catch(err => {
                        reject(err);
                    })
                }, payload)

                resolve();
            })
            
        }
  }

}