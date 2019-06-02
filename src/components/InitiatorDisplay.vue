<template>
  <v-layout row wrap align-center>

    <div v-if="Object.entries(initiator).length != 0" class="mr-2 pb-2">
      <span class="mr-2">By</span>
      <custom-avatar :user="initiator" :clickEnabled="true"></custom-avatar>
    </div>
    <span> {{timeElapsed(postDate)}} </span>

  </v-layout>

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
