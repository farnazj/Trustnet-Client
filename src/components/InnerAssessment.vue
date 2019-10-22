<template>
  <div class="pa-1">

    <v-row class="mb-2" align="center" wrap no-gutters>
      <assessor :user="assessmentObj.assessor" :clickEnabled="true" :isTransitive="assessmentObj.lastVersion.isTransitive"
        :credibilityValue="assessmentObj.lastVersion.postCredibility" class="mb-1">
      </assessor>
      <span v-if="assessmentObj.lastVersion.postCredibility != 0" class="ml-2 mr-1 caption grey--text text--darken-1"> {{confidence}}</span>
      <span v-if="assessmentObj.lastVersion.isTransitive" class="ml-2 mr-1 caption grey--text text--darken-1 "> Adopted through their network</span>
      <span class="ml-2 caption grey--text text--darken-3"> {{timeElapsed(assessmentObj.lastVersion.createdAt)}} </span>
      <span v-if="assessmentObj.history.length" class="ml-2 caption grey--text text--darken-1 cursor-pointer" @click.stop="showHistory">
        Edited</span>
    </v-row>

    <v-row v-if="assessmentObj.lastVersion.body" no-gutters class="pa-1 pr-2 body-2 assessment-text">
      <v-col cols="12">
        <p v-if="!showFullText && bodyWordCount > 25">{{truncatedText}}
          <span class="blue--text text--darken-3 cursor-pointer" @click="showFullText = true">
            show more
          </span>
        </p>
        <p v-else>{{assessmentObj.lastVersion.body}}
          <span v-if="bodyWordCount > 25" class="blue--text text--darken-3 cursor-pointer"
             @click="showFullText = false">
            show less
          </span>
        </p>
      </v-col>
    </v-row>

    <v-divider></v-divider>
  </div>

</template>

<script>
import assessor from '@/components/Assessor'
import timeHelpers from '@/mixins/timeHelpers'
import { mapActions } from 'vuex'

export default {
  components: {
   'assessor': assessor
  },
  props: {
    namespace: {
      type: String,
      required: true
    },
    assessmentObj: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showFullText: false
    }
  },
  computed: {
    truncatedText: function() {
      return this.assessmentObj.lastVersion.body.split(' ').slice(0, 25).join(' ') + '...';
    },
    bodyWordCount: function() {
      return this.assessmentObj.lastVersion.body.split(' ').length;
    },
    confidence: function() {
      let percentage = Math.abs(Math.round(this.assessmentObj.lastVersion.postCredibility * 100));
      return percentage + '% confident';
    }
  },
  methods: {
    showHistory: function() {
      this.populateHistory({
        history: [this.assessmentObj.lastVersion].concat(this.assessmentObj.history),
        assessor: this.assessmentObj.assessor
      });
      this.setHistoryVisiblity(true);
    },
    ...mapActions({
      populateHistory (dispatch, payload) {
        return dispatch(this.namespace + '/populateAssessmentHistory', payload)
      },
      setHistoryVisiblity (dispatch, payload) {
        return dispatch(this.namespace + '/setHistoryVisibility', payload)
      }
    })
  },
  mixins: [timeHelpers]
}

</script>

<style scoped>
.assessment-text p, .assessment-text span {
  font-size: 0.95em;
  line-height: 125%;
}
.center-align {
  vertical-align: middle;
}

</style>
