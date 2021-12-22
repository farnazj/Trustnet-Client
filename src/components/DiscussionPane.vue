<template>
	
  <v-card outlined>
    <v-form class="pl-2 pr-2 my-2">
        <v-textarea auto-grow rows="1" v-model="newComment" label="Add a comment here..." hide-details="auto" append-icon="mdi-send" @click:append="submitComment" color="blue" style="font-size: 14px"></v-textarea>
    </v-form>

    <div class="assessment-col">
      <template v-for="(dItem, index) in thread">
        <!-- <template v-if="index < visibleCommentLimit || remainingCommentsVisible"> -->
          <inner-discussion :key="dItem.eId" :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace" :discussionObj="dItem" :depth="0"></inner-discussion>
          <v-divider :key="`divider-${dItem.eId}`" v-if="index != thread.length - 1"></v-divider>
          <!-- <v-divider :key="`divider-${dItem.eId}`" v-if="index != thread.length - 1 && index != visibleCommentLimit - 1"></v-divider> -->
        <!-- </template> -->
      </template>

      <!-- <span v-if="!remainingCommentsVisible" class="blue--text text--darken-3 interactable" @click="remainingCommentsVisible = true">show more comments
      </span>
      <span v-else class="blue--text text--darken-3 interactable" @click="remainingCommentsVisible = false">hide additional comments
      </span> -->
    </div>
  </v-card>

</template>

<script>
import innerDiscussion from '@/components/InnerDiscussion'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    'inner-discussion': innerDiscussion
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
      discussionMap: null,
      discussionList: null,
      thread: null,
      newComment: ""
    }
  },
  computed: {
    postId() {
      return this.commentState.postIdOfComments;
    },
    comments() {
      return this.commentState.comments;
    },
    assessments() {
      return this.assessmentState.assessments;
    },
    ...mapState({
       assessmentState (state) {
         return state[this.assessmentsNamespace];
       },
       commentState (state) {
         return state[this.commentsNamespace];
       }
    })
  },
  methods: {
    submitComment: function() {
      this.postComment({
          postIdOfComments: this.postId,
          body: this.newComment
      })
      .then(() => {this.newComment = ''})
      .then(this.updateComments);
    },
    updateComments() {
      this.getPostComments({
        postIdOfComments: this.postId
      })
    },
    buildDiscussionMap() {
      const discussionMap = { engagementIds: {}, currentComments: {} }; // Source of objects for building the tree
      const originTimes = {}; // Stores oldest timestamp of all discussion objects

      // Combine the assessments and comments, and label them as such
      for (const aType of ['confirmed', 'questioned', 'refuted']) {
        for (const a of this.assessments[aType]) {
          let ot = a.history.length ? a.history[a.history.length - 1].createdAt : a.lastVersion.createdAt;
          let newA = {...a, assessmentType: aType, eType: 0, eId: `a${a.lastVersion.id}`, parent: null, originTime: ot, replies: []};
          // discussionList.push(newA);
          discussionMap['engagementIds'][newA.eId] = newA;
          originTimes[newA.eId] = ot;
        }
      }
      for (const c of this.comments) {
        let ot = null;
        if (!Object.prototype.hasOwnProperty.call(originTimes, c.setId) || c.createdAt < originTimes[c.setId])
          ot = c.createdAt;
        else
          ot = originTimes[c.setId];
        const newC = {...c, eType: 1, eId: `c${c.id}`, parent: null, originTime: ot, history: [], replies: []};
        discussionMap['engagementIds'][newC.eId] = newC;
        if (newC.version === 1)
          discussionMap['currentComments'][newC.setId] = newC;
        originTimes[newC.setId] = ot;
      }

      this.discussionMap = discussionMap;
    },
    buildDiscussionList() {
      const discussionList = []

      for (const [id, e] of Object.entries(this.discussionMap['engagementIds'])) {
        discussionList.push(e);
      }

      // Sort the discussion chronologically
      discussionList.sort((first, second) => {
        if (first.originTime < second.originTime)
          return -1;
        else if (first.originTime > second.originTime)
          return 1;
        else
          return 0;
      });

      this.discussionList = discussionList;
    },
    processDiscussion() {   // Form the reply tree
      const discussionTree = [];

      for (const d of this.discussionList) {
        if (d.eType && d.version !== 1) {
          this.discussionMap['currentComments'][d.setId].history.push(d)
        }
        else if (!d.eType || (d.ParentCommentId === null && d.ParentAssessmentId === null)) {
          discussionTree.push(d);
        }
        else {
          var currentParent = null;
          if (d.ParentAssessmentId === null) {
            const directParentId = `c${d.ParentCommentId}`;
            const directParent = this.discussionMap['engagementIds'][directParentId];
            currentParent = this.discussionMap['currentComments'][directParent.setId]
          }
          else {
            const directParentId = `a${d.ParentAssessmentId}`;
            if (Object.prototype.hasOwnProperty.call(this.discussionMap['engagementIds'], directParentId)) {
              currentParent = this.discussionMap['engagementIds'][directParentId];
            }
            else {
              for (const recentA of [...this.assessments.confirmed, ...this.assessments.questioned, ...this.assessments.refuted]) {
                for (const a of recentA.history) {
                  if (`a${a.id}` === directParentId) {
                    currentParent = this.discussionMap['engagementIds'][`a${recentA.lastVersion.id}`];
                    break;
                  }
                }
                if (currentParent)
                  break;
              }
            }
          }
          d.parent = currentParent;
          currentParent.replies.push(d);
        }
      }
      
      this.thread = discussionTree;
    },
    ...mapActions({
      postComment (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/postComment', payload)
      },
      getPostComments (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/getPostComments', payload)
      }
    })
  },
  
  watch: {
    // Update the thread only once the assessments and comments have fully updated
    discussionList: {
      handler: 'processDiscussion'
    },
    discussionMap: {
      handler: 'buildDiscussionList'
    },
    comments: {
      deep: true,
      immediate: true,
      handler: 'buildDiscussionMap'
    }

    // postId: {
    //   immediate: true,
    //   handler: 'processDiscussion' // Update the thread only once the assessments and comments have fully updated
    // }
  }
}

</script>

<style scoped>

.assessment-col {
  overflow-y: auto;
  overflow-x: hidden;
  /*overflow-y: hidden;*/
  max-height: 73vh;
  min-height: 73vh;
}

</style>