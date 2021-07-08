<template>
  <div class="pa-1">

    <v-row class="mb-1" align="center" wrap no-gutters>
      <custom-avatar v-if="author" :user="author" :clickEnabled="false" class="mb-1"></custom-avatar>
      
      <!-- <span v-if="assessmentType == 'question' && assessmentObj.lastVersion.sourceIsAnonymous" 
        class="ml-2 mr-1 caption grey--text text--darken-3"> Asked anonymously</span> -->

      <!-- <span v-if="assessmentObj.lastVersion.postCredibility != 0" class="ml-2 mr-1 caption grey--text text--darken-1"> {{confidence}}</span> -->
      <!-- <span v-if="assessmentObj.lastVersion.isTransitive" class="ml-2 mr-1 caption grey--text text--darken-1 "> Adopted through their network</span> -->
      <span class="ml-2 caption grey--text text--darken-3"> {{timeElapsed(commentObj.createdAt)}} </span>
      <!-- <span v-if="assessmentObj.history && assessmentObj.history.length"
      class="ml-2 caption grey--text text--darken-1 interactable" @click.stop="showHistory">
        Edited</span> -->
    </v-row>

    <v-row v-if="commentObj.body" no-gutters class="pa-1 pb-2 body-2 assessment-text">
      <v-col cols="12">
        <v-row v-if="!showFullText && bodyWordCount > 25" class="ma-0">
          <p v-html="truncatedText" class="assessment-text-inner mb-0"></p>
          <span class="blue--text text--darken-3 interactable" @click="showFullText = true">
            show more
          </span>
        </v-row>
        <v-row v-else class="ma-0" >
          <p v-html="commentObj.body" class="assessment-text-inner mb-0">
          </p>
            <span v-if="bodyWordCount > 25" class="blue--text text--darken-3 interactable"
             @click="showFullText = false">
            show less
          </span>
        </v-row>
      </v-col>
    </v-row>

    <!-- <v-divider></v-divider> -->
  </div>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceServices from '@/services/sourceServices'
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
    commentObj: {
      type: Object,
      required: true
    },
  },
  data () {
    return {
      author: null,
      showFullText: false
    }
  },
  computed: {
    truncatedText: function() {
      return this.commentObj.body.split(' ').slice(0, 25).join(' ') + '...';
    },
    bodyWordCount: function() {
      return this.commentObj.body.split(' ').length;
    }
  },
  methods: {
    showHistory: function() {
      this.populateHistory({
        history: [this.assessmentObj.lastVersion].concat(this.assessmentObj.history),
        assessor: this.assessmentObj.assessor
      });
      this.sethistoryVisibility(true);
    },
    ...mapActions({
      populateHistory (dispatch, payload) {
        return dispatch(this.namespace + '/populateAssessmentHistory', payload)
      },
      sethistoryVisibility (dispatch, payload) {
        return dispatch(this.namespace + '/setHistoryVisibility', payload)
      }
    })
  },
  created() {
    sourceServices.getSourceById(this.commentObj.SourceId)
    .then(response => {this.author = response.data});
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

.assessment-text-inner {
  white-space: pre-wrap;
  word-break: break-word;
}

</style>
