<template>

  <v-fade-transition v-if="visible">
    <v-row class="pt-12 engagement-container" no-gutters>
      <v-col cols="12">
        <v-card outlined>

          <v-row align-center fill-height no-gutters>
            
            <v-icon @click="hideContainer" class="clear-sign">{{icons.close}}</v-icon>

            <!-- <v-col cols="6">
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
            </v-col> -->

          <!-- <assessments-pane v-if="assessmentsSelected"></assessments-pane> -->
          <!-- <discussion-pane v-else></discussion-pane> -->

            <v-tabs v-model="tabModel" fixed-tabs slider-color="lime darken-1" background-color="lime lighten-4"
              color="lime darken-4" height="35">
              <v-tab href="#assessments">
                Accurate?
              </v-tab>

              <v-tab href="#discussion">
                Discussion
              </v-tab>
            </v-tabs>

          </v-row>

          <v-tabs-items v-model="tabModel">
            <v-tab-item value="assessments" >
              <assessments-pane></assessments-pane>
            </v-tab-item>

            <v-tab-item value="discussion" >
              <discussion-pane></discussion-pane>
            </v-tab-item>

          </v-tabs-items>

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
    tabModel: {
      get: function() {
        return this.assessmentState.initialEngagementTab;
      },
      set: function(newVal) {
        this.setInitialTab(newVal);
      }
      
    },
    ...mapState({
       assessmentState (state) {
         return state['assessments'];
       },
       commentState (state) {
         return state['comments'];
       }
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
        return dispatch('assessments' + '/hideContainer', payload);
      },
      setInitialTab (dispatch, payload) {
        return dispatch('assessments' + '/setInitialTab', payload);
      }
    })
  }

}

</script>

<style scoped>

/*.right-align {
  text-align: right;
}*/

.engagement-container {
  right: 0px;
  width: 34%;
  max-height: 98vh;
  min-height: 98vh;
  /*overflow-y: auto;*/
  overflow-y: auto;
  bottom: 0px;
}

.clear-sign {
  position: absolute;
  z-index: 1;
}

</style>