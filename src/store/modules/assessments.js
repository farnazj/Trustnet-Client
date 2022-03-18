export default {
  namespaced: true,
  state() {
    return {
      visible: false,
      assessments: {},
      postIdOfAssessments: null,
      historyVisibility: false,
      history: [],
      historyOwner: {},
      initialEngagementTab: null
    }
  },
  mutations: {
    show_assessments: (state) => {
      state.visible = true;
    },

    hide_assessments: (state) => {
      state.visible = false;
      state.postIdOfAssessments = null;
    },

    populate_assessments: (state, payload) => {
      state.postIdOfAssessments = payload.postIdOfAssessments;
      state.assessments = payload.assessments;
    },

    set_history_visibility: (state, visiblity) => {
      state.historyVisibility  = visiblity;
    },

    populate_assessment_history: (state, payload) => {
      state.history = payload.history;
      state.historyOwner = payload.assessor;
    },

    set_initial_engagement_tab: (state, payload) => {
      state.initialEngagementTab = payload;
    }
  },
  actions: {
    showAssessments: (context, payload) => {
      context.commit('populate_assessments', payload);
      context.commit('show_assessments');
    },

    hideContainer: (context) => {
      context.commit('hide_assessments');
    },

    setHistoryVisibility: (context, payload) => {
      context.commit('set_history_visibility', payload);
    },

    populateAssessmentHistory: (context, payload) => {
      context.commit('populate_assessment_history', payload);
    },

    setInitialTab: (context, payload) => {
      context.commit('set_initial_engagement_tab', payload);
    }
  }

}
