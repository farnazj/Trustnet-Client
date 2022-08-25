<template>
	
  <v-card outlined class="discussion-pane-card" tile>
    <v-form class="pl-2 pr-2 my-2">
        <v-textarea auto-grow rows="1" v-model="newComment" label="Add a comment here..." hide-details="auto" append-icon="mdi-send" 
          @click:append="submitComment" color="blue" class="new-comment-textbox"></v-textarea>
    </v-form>

    <div class="discussion-col">
      <template v-for="(dItem, index) in thread">
          <inner-discussion :key="dItem.engagementId" :assessmentsNamespace="assessmentsNamespace" 
            :discussionObj="dItem" :depth="0"></inner-discussion>
          <v-divider :key="`divider-${dItem.engagementId}`" v-if="index != thread.length - 1" class="mt-1"></v-divider>
      </template>
      <p
        @click="getTopLevels"
        v-if="commentsRemaining"
        class="caption blue--text text--darken-3 interactable pl-2 mb-1"
      >
        Show more comments
      </p>
    </div>

  </v-card>

</template>

<script>
import innerDiscussion from '@/components/InnerDiscussion'
import consts from '../services/constants.js'
import { mapState, mapActions, mapGetters } from 'vuex'

const { INITIAL_TOP_LEVEL_COMMENTS_LIMIT, TOP_LEVEL_COMMENTS_LIMIT } = consts;

export default {
  components: {
    'inner-discussion': innerDiscussion
  },
  props: {
    assessmentsNamespace: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      discussionMap: null,
      discussionList: null,
      thread: null,
      newComment: "",
      commentsRemaining: undefined, // Check if comments were exhausted from ArticlePreview fetch
      initialTopLevelCommentsLimit: INITIAL_TOP_LEVEL_COMMENTS_LIMIT,
      topLevelCommentsLimit: TOP_LEVEL_COMMENTS_LIMIT,
      topLevelCommentsOffset: undefined // Start with however many were fetched by ArticlePreview
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
         return state['comments'];
       }
    })
  },
  methods: {
    getTopLevels() {
      this.getPostComments({
        postIdOfComments: this.postId,
        limit: this.topLevelCommentsLimit,
        offset: this.topLevelCommentsOffset
      })
      .then(postComments => {
        this.topLevelCommentsOffset += postComments.length;
        if (postComments.length < this.topLevelCommentsLimit) {
          this.commentsRemaining = false;
        }
      })
    },
    submitComment() {
      this.postComment({
          postIdOfComments: this.postId,
          body: this.newComment
      })
      .then(() => {
        this.updatePostHasComments({ hasComments: true });
        this.newComment = '';
      })
      // .then(this.updateComments);
    },
    updateComments() {
      this.getPostComments({
        postIdOfComments: this.postId
      })
    },
    preprocessAssessment(assessmentObj, assessmentType) {
      const originTime = (assessmentObj.history != null && assessmentObj.history.length)
                                   ? assessmentObj.history[assessmentObj.history.length - 1].createdAt
                                   : assessmentObj.lastVersion.createdAt;
      const newAssessment = {
        ...assessmentObj,
        assessmentType: assessmentType,
        engagementType: 0, // assessment type constant
        engagementId: `a${assessmentObj.lastVersion.id}`,
        parent: null,
        originTime: originTime,
        replies: []
      };
      return newAssessment;
    },
    preprocessComment(commentObj) {
      const newComment = {
        ...commentObj,
        engagementType: 1, // comment type constant
        engagementId: `c${commentObj.id}`,
        parent: null,
        replies: []
      };
      return newComment;
    },
    buildDiscussionMap() {
      const discussionMap = new Map();

      for (const assessmentType of ['confirmed', 'questioned', 'refuted']) {
        for (const assessment of this.assessments[assessmentType]) {
          const newAssessment = this.preprocessAssessment(assessment, assessmentType);
          discussionMap.set(newAssessment.assessor.id.toString(), newAssessment);
        }
      }

      for (const comment of this.comments) {
        const newComment = this.preprocessComment(comment);
        discussionMap.set(newComment.setId, newComment);
      }

      this.discussionMap = discussionMap;
    },
    buildDiscussionList() {
      const discussionList = []

      for (const [id, engagementObj] of this.discussionMap) {
        discussionList.push(engagementObj);
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

      for (const discussionObj of this.discussionList) {
        if (!discussionObj.engagementType || discussionObj.parentId === null) {
          discussionTree.push(discussionObj);
        }
        else {
          let commentParent = this.discussionMap.get(discussionObj.parentSetId.toString());
          discussionObj.parent = commentParent;
          commentParent.replies.push(discussionObj);
        }
      }
      
      this.thread = discussionTree;
    },
    ...mapActions({
      postComment (dispatch, payload) {
        return dispatch('comments' + '/postComment', payload)
      },
      getPostComments (dispatch, payload) {
        return dispatch('comments' + '/getPostComments', payload)
      },
      updatePostHasComments (dispatch, payload) {
        return dispatch('comments' + '/updatePostHasComments', payload)
      }
    })
  },
  
  watch: {
    postId() {
      this.commentsRemaining = undefined;
      this.topLevelCommentsOffset = undefined;
    },
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
      handler(newComments, prevComments) {
        this.buildDiscussionMap();
        if (this.commentsRemaining === undefined) {
          const topLevels = newComments.filter(comment => comment.parentId === null);
          this.topLevelCommentsOffset = topLevels.length;
          this.commentsRemaining = topLevels.length === this.initialTopLevelCommentsLimit;
        }
      }
    }
  }
}

</script>

<style scoped>

.discussion-col {
  /* overflow-y: auto;
  overflow-x: hidden; */
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 85vh;
  min-height: 85vh;
}

.new-comment-textbox {
  font-size: 14px;
}

</style>