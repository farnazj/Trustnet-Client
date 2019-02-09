export default {
  namespaced: true,
  state: {
    show: false,
    assessments: {}
  },
  getters: {
    assessments: state => { return state.assessments; },
    visible: state => { return state.show; }
  },
  mutations: {
    show_assessments: (state) => { state.show = true; },

    hide_assessments: (state) => { state.show = false; },

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
      console.log('yeay')
      context.commit('hide_assessments');
    }
  }
}
