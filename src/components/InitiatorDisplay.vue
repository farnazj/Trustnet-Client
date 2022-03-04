<!--
 @fileoverview A component that is used in ArticlePreview and ArticleDetails to show the initiator source of a 
 post, its author (in the case of a news publishing entity with several authors), and the publish date of the post
-->

<template>
  <v-row wrap align="center" no-gutters>

    <div v-if="Object.entries(initiator).length != 0" class="mr-2 pb-2 caption">
      <span class="mr-1">By</span>
      <custom-avatar :user="initiator" :clickEnabled="true"></custom-avatar>
      <v-divider v-if="author" vertical class="mx-2 initiator-divider" ></v-divider>
      <span v-if="author" class="mr-3">{{author}}</span>
      <span v-if="postDate" :class="{'ml-1':!author}"> {{timeElapsed(postDate)}} </span>
    </div>

  </v-row>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceServices from '@/services/sourceServices'
import timeHelpers from '@/mixins/timeHelpers'

export default {
  components: {
   'custom-avatar': customAvatar
  },
  props: {
    userId: {
      required: false
    },
    postDate: {
      required: true
    },
    author: {
      required: false
    }
  },
  data () {
    return {
      watchedUserId: this.userId,
      initiator: {}
    }
  },
  created() {
    this.getInitiator();

  },
  watch: {
    userId: function(val) {
      this.watchedUserId = val;
      this.getInitiator();
    }
  },
  methods: {

    getInitiator: function() {
      if (this.watchedUserId) {
        sourceServices.getSourceById(this.watchedUserId)
        .then(response => {
          this.initiator = response.data;
        })
      }
    }
  },
  mixins: [timeHelpers]
}
</script>

<style scoped>

.initiator-divider {
  display: inline;
  color: #263238;
  height: 100%;
}
</style>
