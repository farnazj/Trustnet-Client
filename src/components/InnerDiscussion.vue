<template>

<div>
  <div :style="!discussionObj.eType ? 'background-color: #e8f3ff' : 'white'">
    <inner-comment v-if="discussionObj.eType" :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace" :commentObj="discussionObj" :class="{ 'mx-10' : nested }"></inner-comment>
    <inner-assessment v-else :namespace="assessmentsNamespace" :assessmentObj="discussionObj" :assessmentType="discussionObj.assessmentType" :class="{ 'mx-10' : nested }"></inner-assessment>
  </div>

  <template v-if="discussionObj.replies.length">
    <inner-discussion v-for="dItem in discussionObj.replies" :key="dItem.eId" :assessmentsNamespace="assessmentsNamespace" :commentsNamespace="commentsNamespace" :discussionObj="dItem" :nested="true"></inner-discussion>
  </template>

</div>

</template>

<script>
import innerAssessment from '@/components/InnerAssessment'
import innerComment from '@/components/InnerComment'
import innerDiscussion from '@/components/InnerDiscussion'

export default {
  name: 'inner-discussion',
  components: {
   'inner-assessment': innerAssessment,
   'inner-comment': innerComment,
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
    nested: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
}

</script>

<style scoped>

</style>
