export default {
  namespaced: true,
  state() {
    return {
      visible: false,
      assessments: {}  
    }
  },
  getters: {

  },
  mutations: {
    show_assessments: (state) => { state.visible = true; },

    hide_assessments: (state) => { state.visible = false; },

    populate_assessments: (state, assessments) => {
      state.assessments = assessments;
    }
  },
  actions: {
    showAssessments: (context, payload) => {
      context.commit('populate_assessments', payload);
      context.commit('show_assessments');
    },
    hideContainer: (context) => {
      console.log('hideContainer called')
      context.commit('hide_assessments');
    }
  }
}
