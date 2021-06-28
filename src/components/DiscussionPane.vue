<template>
	<v-card @click="testComments">PLACEHOLDER</v-card>
</template>

<script>
import utils from '@/services/utils'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
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
      comments: [{text: "test comment 1"}, {text: "test comment 2"}, {text: "test comment 3"}]
    }
  },
  computed: {
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
    testComments: function() {
      let arr = this.comments.map(el => el.text);
      console.log(arr);
    }
  }

}

</script>

<style scoped>

</style>