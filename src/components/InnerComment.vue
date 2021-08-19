<template>
  <div class="ml-1 my-2" @mouseenter="iconsActive = true" @mouseleave="iconsActive = false">

    <v-row class="mb-n1" align="center" wrap no-gutters>
      <custom-avatar :user="commentObj.Source" :clickEnabled="false" class="mb-1"></custom-avatar>
      
      <span class="ml-2 caption grey--text text--darken-3"> {{timestamp}} </span>
      <span v-if="commentObj.history.length" class="ml-2 caption grey--text text--darken-1 interactable" @click.stop="showHistory">Edited</span>
    </v-row>

    <v-row no-gutters class="pa-1 pb-0 body-2 assessment-text">
      <v-col cols="12" style="z-index: 5">
        <v-form v-if="editing">
          <v-textarea auto-grow rows="1" dense v-model="editText" hide-details="auto" color="blue" style="font-size: 14px" class="assessment-text-inner">
            <template slot="append">
              <v-icon @click="sendEdit" color="blue">mdi-send</v-icon>
              <v-icon @click="editing = false; resetEditText()" color="red">clear</v-icon>
            </template>
          </v-textarea>
        </v-form>

        <v-row v-else-if="!showFullText && bodyWordCount > 25" class="ma-0">
          <p v-html="truncatedText" class="assessment-text-inner mb-0"></p>
          <span class="blue--text text--darken-3 interactable" @click="showFullText = true">
            show more
          </span>
        </v-row>
        <v-row v-else class="ma-0" >
          <p v-html="bodyText" class="assessment-text-inner mb-0">
          </p>
            <span v-if="bodyWordCount > 25" class="blue--text text--darken-3 interactable"
             @click="showFullText = false">
            show less
          </span>
        </v-row>
      </v-col>

      <v-row :style="iconsActive && !editing && !isDeleted ? 'visibility: visible' : 'visibility: hidden'" class="mt-n7 justify-end" align="center" wrap no-gutters>
        <v-btn style="z-index: 5" @click.stop="sendReply" icon>
          <v-icon style="z-index: 5" class="xs-icon-font" color="blue">fa-reply</v-icon>
        </v-btn>
        <v-btn v-if="isUser" style="z-index: 5" @click.stop="editing = true" icon>
          <v-icon style="z-index: 5" class="s-icon-font" color="blue">edit</v-icon>
        </v-btn>
        <v-btn v-if="isUser" style="z-index: 5" @click.stop="sendDelete" icon>
          <v-icon style="z-index: 5" class="xs-icon-font" color="blue">fa-trash</v-icon>
        </v-btn>
      </v-row>

    </v-row>

  </div>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import timeHelpers from '@/mixins/timeHelpers'
import { mapState, mapActions, mapGetters } from 'vuex'

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
      editText: "",
      iconsActive: false
    }
  },
  computed: {
    isDeleted() {
      return this.commentObj.body === null;
    },
    bodyText() {
      return !this.isDeleted ? this.commentObj.body : '[deleted]';
    },
    timestamp() {
      return this.timeElapsed(this.commentObj.originTime);
    },
    truncatedText: function() {
      return this.bodyText.split(' ').slice(0, 25).join(' ') + '...';
    },
    bodyWordCount: function() {
      return this.bodyText.split(' ').length;
    },
    isUser() {
      return this.commentObj.Source.id === this.user.id;
    },
    postId() {
      return this.commentState.postIdOfComments;
    },
    ...mapState({
       commentState (state) {
         return state[this.commentsNamespace];
       }
    }),
    ...mapGetters('auth', [
      'user'
    ])
  },
  methods: {
    showHistory() {
      this.populateHistory({
        history: [this.commentObj, ...([...this.commentObj.history].reverse())],
        author: this.commentObj.Source
      });
      this.sethistoryVisibility(true);
    },
    resetEditText() {
      this.editText = this.commentObj.body !== null ? this.bodyText.slice() : "";
    },
    sendEdit() {
      this.editComment({
          setIdOfComment: this.commentObj.setId,
          body: this.editText
      })
      .then(this.updateComments)
      .then(() => {this.editing = false});
    },
    sendReply() {
      alert('You clicked on a button!')
    },
    sendDelete() { 
      this.deleteComment({
          setIdOfComment: this.commentObj.setId,
      })
      .then(this.updateComments);
    },
    updateComments() {
      this.getPostComments({
        postIdOfComments: this.postId
      })
    },
    ...mapActions({
      populateHistory (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/populateCommentHistory', payload)
      },
      sethistoryVisibility (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/setHistoryVisibility', payload)
      },
      getPostComments (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/getPostComments', payload)
      },
      postComment (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/postComment', payload)
      },
      editComment (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/editComment', payload)
      },
      deleteComment (dispatch, payload) {
        // console.log(payload);
        return dispatch(this.commentsNamespace + '/deleteComment', payload)
      }
    })
  },
  mounted() {
    this.resetEditText()
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

.v-text-field {
  font-size: 1em;
  line-height: 125%;
  padding-bottom: 15px;
}

</style>
