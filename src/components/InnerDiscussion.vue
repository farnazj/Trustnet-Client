<template>
  <div>
    <div :style="!discussionObj.eType ? 'background-color: #e8f3ff' : 'background-color: white'" class="my-2">
      <template v-if="deepNest">

        <v-row class="ml-9 mb-n6">
          <v-col cols="1" class="ml-1">
            <img src="@/assets/icons/reply-notch.svg" alt="nested reply icon" width="22px" height="14px">
          </v-col>

          <v-col cols="1" class="ml-n5 mt-n1">
            <custom-avatar :user="parentAuthor" :size="23" :clickEnabled="false"></custom-avatar>
          </v-col>

          <v-col class="ml-n5 mt-n1">
            <span style="font-size: 11px; color: #c3c3c3;">
              {{parentText}}
            </span>
          </v-col>
        </v-row>

      </template>

      <inner-comment v-if="discussionObj.eType" :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace" :commentObj="discussionObj" :class="{ 'ml-10' : depth }"></inner-comment>
      <inner-assessment v-else :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace" :assessmentObj="discussionObj" :assessmentType="discussionObj.assessmentType" :class="{ 'ml-10' : depth }"></inner-assessment>

    </div>

    <template>
      <inner-discussion v-for="dItem in discussionObj.replies" :key="dItem.eId" :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace" :discussionObj="dItem" :depth="depth + 1"></inner-discussion>
      <p
        @click="getReplies(replyCommentsLimit)"
        v-if="discussionObj.eType && discussionObj.rootSetId === null && commentsRemaining"
        class="caption blue--text text--darken-3 interactable ml-10"
      >
        Show more replies
      </p>
    </template>

  </div>
</template>

<script>
import innerAssessment from '@/components/InnerAssessment'
import innerComment from '@/components/InnerComment'
import innerDiscussion from '@/components/InnerDiscussion'
import customAvatar from '@/components/CustomAvatar'
import sourceServices from '@/services/sourceServices'
import { mdiArrowTopRight } from '@mdi/js';
import { mapState, mapActions } from 'vuex'

export default {
  name: 'inner-discussion',
  components: {
   'inner-assessment': innerAssessment,
   'inner-comment': innerComment,
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
    discussionObj: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      commentsRemaining: true,
      initialReplyCommentsLimit: 2,
      replyCommentsLimit: 4,
      repliesOffset: 0
    }
  },
  computed: {
    deepNest() {
      return this.depth >= 2
    },
    parentAuthor() {
      if (this.deepNest)
        return !this.discussionObj.parent.eType ? this.discussionObj.parent.assessor : this.discussionObj.parent.Source;
      else
        return null;
    },
    parentText() {
      let parentBody = this.discussionObj.parent.body !== null ? this.discussionObj.parent.body : '[deleted]';
      let base = parentBody.split(' ').slice(0, 5).join(' ');
      return base + (base === parentBody ? '' : '...');
    }
  },
  methods: {
    getReplies(lim) {
      this.getReplyComments({
        rootSetId: this.discussionObj.setId,
        limit: lim,
        offset: this.repliesOffset
      })
      .then(replyComments => {
        this.repliesOffset += replyComments.length;
        if (replyComments.length < lim) {
          this.commentsRemaining = false;
        }
      })
    },
    ...mapActions({
      getReplyComments (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/getReplyComments', payload)
      }
    })
  },
  created() {
    this.getReplies(this.initialReplyCommentsLimit);
  }
}

</script>

<style scoped>

.show-more-text {
  font-size: 0.90em;
}

</style>
