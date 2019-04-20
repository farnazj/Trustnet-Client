<template>

<v-fade-transition v-if="visible">
  <v-layout row class="pt-5" id="assessment_container">
    <v-flex xs12>
      <v-card>
        <v-layout row justify-end class="pr-2">
          <v-icon @click="hideContainer">clear</v-icon>
        </v-layout>

      <v-layout v-if="assessments.questioned.length != 0" row wrap class="pa-1">
        <v-flex xs12>
          <v-card-title>
           <div>
             <h4 class="mb-1">Questioned by</h4>
           </div>
         </v-card-title>

         <template v-for="assessment in getAssessmentsSlice('questioned')" >
           <inner-assessment :assessment="assessment" :key="assessment.id"> </inner-assessment>
         </template>

        </v-flex>
      </v-layout>

      <v-layout v-if="assessments.questioned.length != 0" row class="pa-1">
        <span v-if="assessmentsRemaining('questioned')" @click="revealMore('questioned')"
          class="blue--text text--darken-3 body-2 cursor-pointer">
          Show More Assessments</span>
        <v-spacer></v-spacer>
        <span class="grey--text text--darken-3 pr-1"> {{getAssessmentStats('questioned')}} </span>
      </v-layout>

    </v-card>
      <v-layout row class="border-top">
        <template v-for="(key,index) in ['confirmed', 'refuted']" >
          <v-flex :key="index" :xs6="isDebated" :xs12="!isDebated" v-if="assessments[key].length != 0">

            <v-card class="assessment-col">

              <v-card-title>
               <div>
                 <h4 class="mb-1" v-if="key == 'confirmed'"> Verifications</h4>
                 <h4 class="mb-1" v-else-if="key == 'refuted'"> Refutations</h4>
               </div>
             </v-card-title>
             <v-divider ></v-divider>

              <template v-for="assessment in getAssessmentsSlice(key)" >
                <inner-assessment :assessment="assessment" :key="assessment.id"> </inner-assessment>
              </template>

              <v-layout row class="pa-1">
                <span v-if="assessmentsRemaining(key)" @click="revealMore(key)"
                  class="blue--text text--darken-3 body-2 cursor-pointer">
                  Show More Assessments</span>
                <v-spacer></v-spacer>
                <span class="grey--text text--darken-3 pr-1"> {{getAssessmentStats(key)}} </span>
              </v-layout>

           </v-card>

          </v-flex>
        </template>
      </v-layout>

    </v-flex>
  </v-layout>
</v-fade-transition>

</template>

<script>
import innerAssessment from '@/components/InnerAssessment'
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
  data () {
    return {
      revealedSize: {}
    }
  },
  computed: {

    isDebated: function () {
      return this.assessments.confirmed.length && this.assessments.refuted.length;
    },
    assessments: function() {
      return this.state.assessments;
    },
    visible: function() {
      return this.state.visible;
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
      return this.assessments[key].slice(0, this.revealedSize[key]);
    },
    getAssessmentStats: function(key) {
      return this.getAssessmentsSlice(key).length + ' of ' + this.assessments[key].length;
    },
    assessmentsRemaining: function(key) {
      return this.getAssessmentsSlice(key).length < this.assessments[key].length;
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
  width: 40%;
  max-height: 96vh;
  min-height: 96vh;
  overflow-y: auto;
}

.assessment-col {
  overflow-y: scroll;
  min-height: 90vh;
  max-height: 90vh;
}

.assessment-col:first-child {
  border-right: 1px solid #B0BEC5;
}

.border-top {
  border-top: 1px solid #B0BEC5;
}

</style>
