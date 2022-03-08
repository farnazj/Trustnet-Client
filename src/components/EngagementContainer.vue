<template>

  <v-fade-transition v-if="visible">
    <v-row class="pt-12" id="assessment_container" no-gutters>
      <v-col cols="12">
        <v-card outlined>

          <v-row align-center fill-height no-gutters>
            
            <v-icon @click="hideContainer" class="clear-sign">{{icons.close}}</v-icon>

            <v-col cols="6">
              <v-card outlined :color="assessmentsSelected ? 'lime lighten-3' : 'white'" @click="selectAssessments">
                <v-row justify="center" no-gutters>
                  <p class="pb-0 mb-0 subheading font-weight-medium">Accurate?</p>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="6">
              <v-card outlined :color="!assessmentsSelected ? 'lime lighten-3' : 'white'" @click="selectDiscussion">
                <v-row justify="center" no-gutters>
                  <p class="pb-0 mb-0 subheading font-weight-medium">Discussion</p>
                </v-row>
              </v-card>
            </v-col>

          </v-row>

          <assessments-pane v-if="assessmentsSelected" :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace"></assessments-pane>
          <discussion-pane v-else :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace"></discussion-pane>

        </v-card>
      </v-col>
    </v-row>
  </v-fade-transition>

</template>

<script>
import assessmentsPane from '@/components/AssessmentsPane'
import discussionPane from '@/components/DiscussionPane'
import utils from '@/services/utils'
import { mapState, mapActions } from 'vuex'
import { mdiClose } from '@mdi/js';

export default {
  components: {
   'assessments-pane': assessmentsPane,
   'discussion-pane': discussionPane
  },
  props: {
    assessmentsNamespace: {
      type: String,
      required: true
    },
    commentsNamespace: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      assessmentsSelected: true,
      icons: {
        close: mdiClose
      }
    }
  },
  computed: {
    visible: function() {
      return this.assessmentState.visible;
    },
    ...mapState({
       assessmentState (state) {
         return state[this.assessmentsNamespace];
       },
       commentState (state) {
         return state[this.commentsNamespace];
       },
    })

  },
  methods: {
    selectAssessments: function(key) {
      this.assessmentsSelected = true;
    },
    selectDiscussion: function(key) {
      this.assessmentsSelected = false;
    },
    ...mapActions({
      hideContainer (dispatch, payload) {
        return dispatch(this.assessmentsNamespace + '/hideContainer', payload)
      }
    })
  }

}

</script>

<style scoped>

/*.right-align {
  text-align: right;
}*/

#assessment_container {
  right: 0px;
  width: 34%;
  max-height: 98vh;
  min-height: 98vh;
  /*overflow-y: auto;*/
  overflow-y: hidden;
  bottom: 0px;
}

/*.assessment-col {
  overflow-y: scroll;
  max-height: 90vh;
  min-height: 90vh;
}*/

.assessment-col:first-child {
  border-right: 1px solid #B0BEC5;
}

.clear-sign {
  position: absolute;
  z-index: 1;
}

</style>