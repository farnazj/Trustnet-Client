<template>
	
  <v-card class="assessment-col" outlined>
    <!-- <v-text-field></v-text-field> -->
    <template v-for="dItem in thread">
      <inner-discussion :key="dItem.eId" :namespace="assessmentsNamespace" :discussionObj="dItem" :nested="false"></inner-discussion>
      <v-divider :key="`divider-${dItem.eId}`"></v-divider>
    </template>
  </v-card>

</template>

<script>
import innerDiscussion from '@/components/InnerDiscussion'
import utils from '@/services/utils'
import { mapState, mapActions } from 'vuex'

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
    }
  },
  computed: {
    comments() {
      return this.commentState.comments;
    },
    assessments() {
      return this.assessmentState.assessments;
    },
    thread() {
      return this.processDiscussion();
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
      return discussionTree;
    },
  }

}

</script>

<style scoped>

.assessment-col {
  /*overflow-y: scroll;*/
  overflow-y: hidden;
  /*max-height: 90vh;*/
  min-height: 90vh;
}

</style>