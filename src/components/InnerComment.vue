<template>
  <div class="pa-1">

    <v-row class="mb-n1" align="center" wrap no-gutters>
      <custom-avatar :user="commentObj.Source" :clickEnabled="false" class="mb-1"></custom-avatar>
      
      <span class="ml-2 caption grey--text text--darken-3"> {{timestamp}} </span>
      <span v-if="commentObj.history.length" class="ml-2 caption grey--text text--darken-1 interactable" @click.stop="showHistory">Edited</span>
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
    assessmentsNamespace: {
      type: String,
      required: true
    },
    commentsNamespace: {
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
      // author: null,
      showFullText: false
    }
  },
  computed: {
    timestamp() {
      return this.timeElapsed(this.commentObj.originTime);
    },
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
        history: [this.commentObj, ...([...this.commentObj.history].reverse())],
        author: this.commentObj.Source
      });
      this.sethistoryVisibility(true);
    },
    ...mapActions({
      populateHistory (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/populateCommentHistory', payload)
      },
      sethistoryVisibility (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/setHistoryVisibility', payload)
      }
    })
  },
  // created() {
  //   sourceServices.getSourceById(this.commentObj.SourceId)
  //   .then(response => {this.author = response.data});
  // },
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
