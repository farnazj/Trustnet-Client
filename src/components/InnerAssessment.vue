<template>
  <div  class="pa-1">

    <v-layout row class="mb-2">
      <v-flex xs12>
        <custom-avatar :user="assessmentObj.assessor" :clickEnabled="true" :size="35"
         :class="{transitive: assessmentObj.lastVersion.isTransitive}">
        </custom-avatar>
        <span v-if="assessmentObj.lastVersion.isTransitive" class="ml-2 mr-1 caption grey--text text--darken-1"> Adopted through their network</span>
        <span class="ml-2 caption grey--text text--darken-3"> {{timeElapsed(assessmentObj.lastVersion.updatedAt)}} </span>
        <span v-if="assessmentObj.history.length" class="ml-2 caption grey--text text--darken-1 cursor-pointer" @click.stop="showHistory">
          Edited</span>
      </v-flex>
    </v-layout>

    <v-layout row v-if="assessmentObj.lastVersion.body">
      <v-flex xs12>
        <p v-if="!showFullText && bodyWordCount > 10">{{truncatedText}}
          <span class="blue--text text--darken-3 body-2 cursor-pointer" @click="showFullText = true">
            show more
          </span>
        </p>
        <p v-else>{{assessmentObj.lastVersion.body}}
          <span v-if="bodyWordCount > 10" class="blue--text text--darken-3 body-2 cursor-pointer"
             @click="showFullText = false">
            show less
          </span>
        </p>

      </v-flex>
    </v-layout>

    <v-divider></v-divider>
  </div>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import timeHelpers from '@/mixins/timeHelpers'
import { mapActions } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar
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
      return this.assessmentObj.lastVersion.body.split(' ').slice(0, 10).join(' ') + '...';
    },
    bodyWordCount: function() {
      return this.assessmentObj.lastVersion.body.split(' ').length;
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


</style>
