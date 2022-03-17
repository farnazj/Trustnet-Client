<template>
	
  <v-card outlined class="discussion-pane-card">
    <v-form class="pl-2 pr-2 my-2">
        <v-textarea auto-grow rows="1" v-model="newComment" label="Add a comment here..." hide-details="auto" append-icon="mdi-send" 
          @click:append="submitComment" color="blue" class="new-comment-textbox"></v-textarea>
    </v-form>

    <div class="discussion-col">
      <template v-for="(dItem, index) in thread">
          <inner-discussion :key="dItem.eId" :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace" 
            :discussionObj="dItem" :depth="0"></inner-discussion>
          <v-divider :key="`divider-${dItem.eId}`" v-if="index != thread.length - 1" class="mt-1"></v-divider>
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
         return state[this.commentsNamespace];
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
      .then(() => {this.newComment = ''})
      // .then(this.updateComments);
    },
    updateComments() {
      this.getPostComments({
        postIdOfComments: this.postId
      })
    },
    preprocessAssessment(obj, aType) {
      const ot = (obj.history != null && obj.history.length) ? obj.history[obj.history.length - 1].createdAt : obj.lastVersion.createdAt;
      const newA = {
        ...obj,
        assessmentType: aType,
        eType: 0,
        eId: `a${obj.lastVersion.id}`,
        parent: null,
        originTime: ot,
        replies: []
      };
      return newA;
    },
    preprocessComment(obj) {
      const newC = {
        ...obj,
        eType: 1,
        eId: `c${obj.id}`,
        parent: null,
        originTime: obj.createdAt,
        replies: []
      };
      return newC;
    },
    buildDiscussionMap() {
      const discussionMap = new Map();

      for (const aType of ['confirmed', 'questioned', 'refuted']) {
        for (const a of this.assessments[aType]) {
          const newA = this.preprocessAssessment(a, aType);
          discussionMap.set('' + newA.assessor.id, newA); //empty string prepended to convert sourceId from number to string
        }
      }

      for (const c of this.comments) {
        const newC = this.preprocessComment(c);
        discussionMap.set(newC.setId, newC);
      }

      this.discussionMap = discussionMap;

      // console.log(discussionMap)
    },
    buildDiscussionList() {
      const discussionList = []

      for (const [id, e] of this.discussionMap) {
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
        if (!d.eType || d.parentId === null) {
          discussionTree.push(d);
        }
        else {
          let commentParent = this.discussionMap.get('' + d.parentSetId);
          d.parent = commentParent;
          commentParent.replies.push(d);
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
  overflow-y: scroll;
  max-height: 85vh;
  min-height: 85vh;
}

.new-comment-textbox {
  font-size: 14px;
}

</style>