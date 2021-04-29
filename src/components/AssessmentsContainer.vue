<template>

  <v-fade-transition v-if="visible">
    <v-row class="pt-12" id="assessment_container" no-gutters>
      <v-col cols="12">
        <v-card outlined tile>

          <v-row align-center fill-height no-gutters>
            
            <v-col cols="6">
              <v-card outlined tile fill-height v-bind:color="assessmentsColor" @click="selectAssessments">
                <v-row justify="center" no-gutters>
                  <p class="pb-0 mb-0 subheading font-weight-medium">Accurate?</p>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card outlined tile v-bind:color="discussionColor" @click="selectDiscussion">
                <v-row justify="center" no-gutters>
                  <p class="pb-0 mb-0 subheading font-weight-medium">Discussion</p>
                </v-row>
              </v-card>
            </v-col>

            <v-icon @click="hideContainer" class="clear-sign">clear</v-icon>

          </v-row>

          <v-divider v-if="sortedAssessments.questioned.length"></v-divider>

          <v-row v-if="sortedAssessments.questioned.length" row wrap class="pa-1" no-gutters>
            <v-col cols="12">
              <v-card-title>
               <div>
                 <p class="body-2 font-weight-medium mb-1">Questioned</p>
               </div>
             </v-card-title>

             <template v-for="assessment in getAssessmentsSlice('questioned')" >
               <inner-assessment :assessmentObj="assessment" :namespace="namespace"
                :key="assessment.lastVersion.id" assessmentType="question"></inner-assessment>
                
             </template>

            </v-col>
          </v-row>

          <v-row v-if="sortedAssessments.questioned.length != 0" row class="pa-1" no-gutters>
            <span v-if="assessmentsRemaining('questioned')" @click="revealMore('questioned')"
              class="blue--text text--darken-3 body-2 interactable">
              Show More Assessments</span>
            <v-spacer></v-spacer>
            <span class="caption grey--text text--darken-3 pr-1"> {{getAssessmentStats('questioned')}} </span>
          </v-row>

        </v-card>

        <v-row no-gutters>
          <template v-for="(key, index) in ['confirmed', 'refuted']" >
            <v-col :key="index" :xs6="isDebated" :xs12="!isDebated" v-if="sortedAssessments[key].length != 0">

              <v-card class="assessment-col" outlined>

                <v-card-title>
                 <div>
                   <p class="mb-1 body-2 font-weight-medium" v-if="key == 'confirmed'"> Yes</p>
                   <p class="mb-1 body-2 font-weight-medium" v-else-if="key == 'refuted'"> No</p>
                 </div>
               </v-card-title>
               <v-divider ></v-divider>

                <template v-for="assessment in getAssessmentsSlice(key)" >
                  <inner-assessment :assessmentObj="assessment" :namespace="namespace"
                  :key="assessment.lastVersion.id" :assessmentType="key"></inner-assessment>
                </template>

                <v-row no-gutters class="pa-1">
                  <span v-if="assessmentsRemaining(key)" @click="revealMore(key)"
                    class="blue--text text--darken-3 body-2 interactable">
                    Show More Assessments</span>
                  <v-spacer></v-spacer>
                  <span class="caption grey--text text--darken-3 pr-1"> {{getAssessmentStats(key)}} </span>
                </v-row>

             </v-card>

            </v-col>
          </template>
        </v-row>

      </v-col>
    </v-row>
  </v-fade-transition>

</template>

<script>
import innerAssessment from '@/components/InnerAssessment'
import utils from '@/services/utils'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
   'inner-assessment': innerAssessment
  },
  props: {
    namespace: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      revealedSize: {},
      assessmentsSelected: true,
    }
  },
  computed: {
    sortedAssessments: function() {
      let sortedAssessments = {};
      for (const [key, value] of Object.entries(this.assessments))
        sortedAssessments[key] = this.assessments[key].slice().sort(utils.compareAssessments);

      return sortedAssessments;
    },
    isDebated: function () {
      return this.assessments.confirmed.length && this.assessments.refuted.length;
    },
    assessments: function() {
      return this.state.assessments;
    },
    visible: function() {
      return this.state.visible;
    },
    assessmentsColor: function() {
      return this.assessmentsSelected ? "lime lighten-3" : "white"
    },
    discussionColor: function() {
      return !(this.assessmentsSelected) ? "lime lighten-3" : "white"
    },
    ...mapState({
       state (state) {
         return state[this.namespace];
       }
    })

  },
  methods: {
    resetRevealedSize: function() {
      this.revealedSize = {'questioned': 4, 'confirmed': 5, 'refuted': 5};
    },
    revealMore: function(key) {
      this.revealedSize[key] += 5;
    },
    getAssessmentsSlice: function(key) {
      return this.sortedAssessments[key].slice(0, this.revealedSize[key]);
    },
    getAssessmentStats: function(key) {
      return this.getAssessmentsSlice(key).length + ' of ' + this.sortedAssessments[key].length;
    },
    assessmentsRemaining: function(key) {
      return this.getAssessmentsSlice(key).length < this.sortedAssessments[key].length;
    },
    selectAssessments: function(key) {
      this.assessmentsSelected = true;
    },
    selectDiscussion: function(key) {
      this.assessmentsSelected = false;
    },
    ...mapActions({
      hideContainer (dispatch, payload) {
        return dispatch(this.namespace + '/hideContainer', payload)
      }
    })
  },
  watch: {
    assessments: function() {
      this.resetRevealedSize();
    }
  }

}
</script>

<style scoped>
.right-align {
  text-align: right;
}

#assessment_container {
  right: 0px;
  width: 34%;
  max-height: 95vh;
  min-height: 95vh;
  overflow-y: auto;
  bottom: 0px;
}

.assessment-col {
  overflow-y: scroll;
  max-height: 90vh;
  min-height: 90vh;
}

.assessment-col:first-child {
  border-right: 1px solid #B0BEC5;
}

.clear-sign {
  position: absolute;
}

</style>
