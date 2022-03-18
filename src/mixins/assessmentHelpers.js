import utils from '@/services/utils'
import sourceServices from '@/services/sourceServices'
import consts from '@/services/constants'
import { mapState, mapActions } from 'vuex'

export default {
  data: () => {
    return {
      assessments: {'confirmed': [], 'refuted': [], 'questioned': []}
    }
  },
  computed: {
    sortedAssessments: function() {

      let sortedAssessments = {};

      for (const [key, value] of Object.entries(this.assessments)) {
        sortedAssessments[key] = this.assessments[key].slice().sort(utils.compareAssessments);
      }
      return sortedAssessments;
    }
  },
  methods: {
    accuracyMapping: function(credibility) {

      if (credibility < consts.ACCURACY_CODES.QUESTIONED)
        return 'refuted';
      else if (credibility == consts.ACCURACY_CODES.QUESTIONED)
        return 'questioned';
      else if (credibility > consts.ACCURACY_CODES.QUESTIONED)
        return 'confirmed';
    },

    restructureAssessments: function() {

      for (let key in this.assessments)
        this.assessments[key] = [];

      let assessmentsBySource = {};
      this.post.PostAssessments.forEach(postAssessment => {

        if (postAssessment.SourceId === null ) { //when the SourceId is retracted because they have asked a question anonymously
          if (postAssessment.version == 1) {
            let assessmentsObj = { lastVersion: postAssessment, assessor: {} };
            let credValue = this.accuracyMapping(assessmentsObj.lastVersion.postCredibility);
            this.assessments[credValue].push(assessmentsObj);
          }
        }
        else {
          if (!(postAssessment.SourceId in assessmentsBySource)) {

            let assessmentsObj = {};
            assessmentsObj['history'] = [];
            assessmentsBySource[postAssessment.SourceId] = assessmentsObj;
          }

          if (postAssessment.version == 1)
            assessmentsBySource[postAssessment.SourceId]['lastVersion'] = postAssessment;
          else
            assessmentsBySource[postAssessment.SourceId]['history'].push(postAssessment);

        }

     })

    /*
    If an earlier version of a question had not been anonymous but the more recent ones are,
    this case can happen that assessmentsBySource[sourceId] for that SourceId can have a history
    property but not lastVersion. We remove this (the earlier versions) from the assessments.
    */
    for (const sourceId in assessmentsBySource) {
      if (!('lastVersion' in assessmentsBySource[sourceId]))
        delete assessmentsBySource[sourceId];
    }

    let sourcePromises = [];

     for (const [SourceId, assessmentsObj] of Object.entries(assessmentsBySource)) {
        let credValue = this.accuracyMapping(assessmentsObj.lastVersion.postCredibility);
        sourcePromises.push(
          sourceServices.getSourceById(SourceId)
          .then(response => {
            assessmentsBySource[SourceId]['assessor'] = response.data;
            this.assessments[credValue].push(assessmentsObj);
          })
      );
     }

     return sourcePromises;
    }

  }

}
