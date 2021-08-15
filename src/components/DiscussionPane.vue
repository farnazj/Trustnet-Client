<template>
	
  <v-card outlined>
    <v-form class="pl-2 pr-2">
        <v-text-field auto-grow v-model="comment"  label="Add a comment here..." hide-details="auto">
        </v-text-field>
      <v-row class="pa-2 justify-end" align="centre" wrap no-gutters>
        <v-btn @click.stop="onSubmit" small color="primary">Submit
        </v-btn>
      </v-row>
    </v-form>

    <div class="assessment-col">
      <template v-for="dItem in thread">
        <inner-discussion :key="dItem.eId" :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace" :discussionObj="dItem" :nested="false"></inner-discussion>
        <v-divider :key="`divider-${dItem.eId}`"></v-divider>
      </template>
    </div>
  </v-card>

</template>

<script>
import innerDiscussion from '@/components/InnerDiscussion'
import utils from '@/services/utils'
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
  data:() =>  ({
    thread: null,
    comment: ""
  }),
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
       },
    })
  },
  methods: {
    onSubmit: function() {
      this.submitComment({
          postIdOfComments: this.commentState.postIdOfComments,
          body: this.comment
      });
      this.clearComment()
      this.updateComments()
    },
    clearComment () {
      this.comment = ''
    },
    updateComments () {
      this.getPostComments({
        postIdOfComments: this.commentState.postIdOfComments
      })  
    },  
    processDiscussion() {
      const discussionList = []; // For sorting purposes, as object property sorting can be unpredictable
      const discussionMap = {}; // Source of objects for building the tree
      const originTimes = {}; // Stores oldest timestamp of all discussion objects

      // Combine the assessments and comments, and label them as such
      for (const aType of ['confirmed', 'questioned', 'refuted']) {
        for (const a of this.assessments[aType]) {
          let ot = a.history.length ? a.history[a.history.length - 1].createdAt : a.lastVersion.createdAt;
          let newA = {...a, assessmentType: aType, eType: 0, eId: `a${a.lastVersion.id}`, originTime: ot, replies: []};
          discussionList.push(newA);
          discussionMap[newA.eId] = newA;
          originTimes[newA.eId] = ot;
        }
      }
      for (const c of this.comments) {
        let ot = null;
        if (!Object.prototype.hasOwnProperty.call(originTimes, c.setId) || c.createdAt < originTimes[c.setId])
          ot = c.createdAt;
        else
          ot = originTimes[c.setId];
        const newC = {...c, eType: 1, eId: `c${c.id}`, originTime: ot, history: [], replies: []};
        discussionList.push(newC);
        discussionMap[newC.eId] = newC;
        if (newC.version === 1)
          discussionMap[newC.setId] = newC;
        originTimes[newC.setId] = ot;
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

      // Form the reply tree
      const discussionTree = [];
      for (const d of discussionList) {
        if (d.eType && d.version !== 1) {
          discussionMap[d.setId].history.push(d)
        }
        else if (!d.eType || (d.ParentCommentId === null && d.ParentAssessmentId === null)) {
          discussionTree.push(d);
        }
        else {
          var currentParent = null;
          if (d.ParentAssessmentId === null) {
            const directParentId = `c${d.ParentCommentId}`;
            const directParent = discussionMap[directParentId];
            currentParent = discussionMap[directParent.setId]
          }
          else {
            const directParentId = `a${d.ParentAssessmentId}`;
            if (Object.prototype.hasOwnProperty.call(discussionMap, directParentId)) {
              currentParent = discussionMap[directParentId];
            }
            else {
              for (const recentA of [...this.assessments.confirmed, ...this.assessments.questioned, ...this.assessments.refuted]) {
                for (const a of recentA.history) {
                  if (`a${a.id}` === directParentId) {
                    currentParent = discussionMap[`a${recentA.lastVersion.id}`];
                    break;
                  }
                }
                if (currentParent)
                  break;
              }
            }
          }
          currentParent.replies.push(d);
        }
      }
      this.thread = discussionTree;
    },
    ...mapActions({
      submitComment (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/submitComment', payload)
      },
      getPostComments (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/getPostComments', payload)
      }
    })
  },
  
  watch: {
    postId: {
      immediate: true,
      handler: 'processDiscussion' // Update the thread only once the assessments and comments have fully updated
    }
  },
}

</script>

<style scoped>

.assessment-col {
  overflow-y: auto;
  /*overflow-y: hidden;*/
  max-height: 73vh;
  min-height: 73vh;
}

</style>