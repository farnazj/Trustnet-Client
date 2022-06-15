<template>
  <div class="ml-1 my-2" @mouseenter="iconsActive = true" @mouseleave="iconsActive = false">

    <v-row class="mb-n1" align="center" wrap no-gutters>
      <custom-avatar :user="commentObj.Source" :clickEnabled="false" :size="23" class="mb-1"></custom-avatar>
      
      <span class="ml-2 caption grey--text text--darken-3"> {{timestamp}} </span>
      <span v-if="isEdited" class="ml-2 caption grey--text text--darken-1 interactable elevated" @click.stop="showHistory">Edited</span>
    </v-row>

    <v-row no-gutters class="pa-1 pb-0 body-2 assessment-text">
      <v-col cols="12" class="elevated">
        <v-form v-if="editing">
          <v-textarea auto-grow rows="1" :autofocus="true" dense v-model="editText" hide-details="auto" color="blue" class="assessment-text-inner">
            <template slot="append">
              <v-btn x-small @click="sendEdit" icon class="mr-1">
                <v-icon  small color="blue" >mdi-send</v-icon>
              </v-btn>

              <v-btn x-small @click="editing = false; resetEditText()" icon class="mr-1">
                <v-icon  small color="red" >clear</v-icon>
              </v-btn>

            </template>
          </v-textarea>
        </v-form>

        <v-row v-else-if="!showFullText && bodyWordCount > 25" class="ma-0">
          <p v-html="truncatedText" class="assessment-text-inner mb-0"></p>
          <span class="blue--text text--darken-3 interactable show-more-less" @click="showFullText = true">
            show more
          </span>
        </v-row>
        <v-row v-else class="ma-0 mb-1">
          <p v-html="bodyText" class="assessment-text-inner mb-n2"></p>
            <span v-if="bodyWordCount > 25" class="blue--text text--darken-3 interactable mt-2 show-more-less"
             @click="showFullText = false">
            show less
          </span>
        </v-row>
      </v-col>

      <v-textarea v-if="replying" placeholder="Add a reply here..." outlined auto-grow rows="1" :autofocus="true" dense v-model="replyText" 
        hide-details="auto" color="blue" :class="`pt-3 ${!isReply ? 'ml-10' : 'ml-0'} assessment-text-inner new-comment`">
        <template slot="append">
          <v-icon @click="sendReply" color="blue">mdi-send</v-icon>
          <v-icon @click="replying = false; replyText = ''" color="red">clear</v-icon>
        </template>
      </v-textarea>

      <v-row :style="iconsActive && !editing && !replying && !isDeleted ? 'visibility: visible' : 'visibility: hidden'" class="mt-n7 justify-end" align="center" wrap no-gutters>
        <v-btn x-small @click.stop="replying = true; iconsActive = false" icon class="mr-1 elevated">
          <v-icon small color="blue">fa-reply</v-icon>
        </v-btn>
        <v-btn v-if="isUser" x-small @click.stop="editing = true; iconsActive = false" icon class="mr-1 elevated">
          <v-icon small color="blue">edit</v-icon>
        </v-btn>
        <v-btn v-if="isUser" x-small @click.stop="sendDelete(); iconsActive = false" icon class="elevated">
          <v-icon x-small color="blue">fa-trash</v-icon>
        </v-btn>
      </v-row>

    </v-row>

  </div>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import timeHelpers from '@/mixins/timeHelpers'
import commentServices from '@/services/commentServices'
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
      replying: false,
      replyText: "",
      iconsActive: false
    }
  },
  computed: {
    isEdited() {
      return this.commentObj.createdAt !== this.commentObj.originTime;
    },
    isDeleted() {
      return this.commentObj.body === null;
    },
    bodyText() {
      return !this.isDeleted ? this.commentObj.body : '[deleted]';
    },
    isReply() {
      return this.commentObj.ParentAssessmentId !== null || this.commentObj.ParentCommentId !== null;
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
      return (this.commentObj.SourceId ? this.commentObj.SourceId : this.commentObj.Source.id) === this.user.id;
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
      commentServices.getCommentHistory(this.commentObj.setId)
      .then(rawCommentHistory => {
        const commentHistory = rawCommentHistory.data.reverse();
        this.populateHistory({
          history: commentHistory,
          author: this.commentObj.Source
        });
        this.sethistoryVisibility(true);
      })
      .catch(() => {
        console.log("Comment history could not be obtained")
      });
      
    },
    resetEditText() {
      this.editText = this.commentObj.body !== null ? this.bodyText.slice() : "";
    },
    sendEdit() {
      this.editComment({
          setIdOfComment: this.commentObj.setId,
          body: this.editText
      })
      .then(() => {this.editing = false});
    },
    sendReply() {
      this.postComment({
          body: this.replyText,
          repliesTo: this.commentObj.id,
          repliesToType: 1
      })
      .then(() => {
        this.updatePostHasComments({ hasComments: true });
        this.iconsActive = false;
        this.replying = false;
        this.replyText = '';
      })
    },
    sendDelete() { 
      this.deleteComment({
          setIdOfComment: this.commentObj.setId,
      })
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
        return dispatch(this.commentsNamespace + '/deleteComment', payload)
      },
      updatePostHasComments (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/updatePostHasComments', payload)
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
  font-size: 0.85em;
  line-height: 125%;
}
.center-align {
  vertical-align: middle;
}

.assessment-text-inner {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
}

.v-text-field {
  font-size: 1em;
  line-height: 125%;
  padding-bottom: 15px;
}

.elevated {
  z-index: 5;
}

.new-comment {
  font-size: 14px;
  width: 500px;
}

.show-more-less {
  z-index: 6;
}

</style>
