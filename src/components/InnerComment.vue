<template>
  <div class="pa-1">

    <v-row class="mb-n1" align="center" wrap no-gutters>
      <custom-avatar :user="commentObj.Source" :clickEnabled="false" class="mb-1"></custom-avatar>
      
      <span class="ml-2 caption grey--text text--darken-3"> {{timestamp}} </span>
      <span v-if="commentObj.history.length" class="ml-2 caption grey--text text--darken-1 interactable" @click.stop="showHistory">Edited</span>
    </v-row>

    <v-row v-if="commentObj.body" no-gutters class="pa-1 pb-0 body-2 assessment-text">
      <v-col cols="12">
        <v-form v-if="editing">
          <v-text-field class="assessment-text-inner" dense v-model="commentObj.body" hide-details="auto" append-icon="mdi-send" @click:append="onDone">
          </v-text-field>
        </v-form>

        <v-row v-else-if="!showFullText && bodyWordCount > 25" class="ma-0">
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

    <v-row v-if="!editing" class="mb-1 justify-end" align="centre" wrap no-gutters>
      <v-btn @click.stop="onEdit" icon>
        <v-icon class="s-icon-font">edit</v-icon>
      </v-btn>
      <v-btn @click.stop="onReply" icon>
        <v-icon class="xs-icon-font">fa-reply</v-icon>
      </v-btn>
      <v-btn @click.stop="onDelete" icon>
        <v-icon class="xs-icon-font">fa-trash</v-icon>
      </v-btn>
    </v-row>

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
  data() {
    return {
      showFullText: false,
      editing: false,
      comment: ""
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
    onDone: function() {
      this.editComment({
          setIdOfComment: this.commentObj.setId,
          body: this.commentObj.body
      });
      this.doneEditing()
    },
    doneEditing() {
      this.editing = false
    },
    onEdit() {
      console.log(this.commentObj)
      this.editing = true
    },
    onReply() {
      alert('You clicked on a button!')
    },
    onDelete () { 
      this.deleteComment({
          setIdOfComment: this.commentObj.setId,
      });
    },
    ...mapActions({
      populateHistory (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/populateCommentHistory', payload)
      },
      sethistoryVisibility (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/setHistoryVisibility', payload)
      },
      deleteComment (dispatch, payload) {
        console.log(payload);
        return dispatch(this.commentsNamespace + '/deleteComment', payload)
      },
      editComment (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/editComment', payload)
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

.v-text-field {
  font-size: 1em;
  line-height: 125%;
  padding-bottom: 15px;
}

</style>
