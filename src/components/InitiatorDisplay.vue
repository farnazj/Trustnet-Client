<template>
  <v-layout align-center>

    <div v-if="Object.entries(initiator).length != 0" class="mr-2">
      <span class="mr-2">By</span>
      <custom-avatar :user="initiator"></custom-avatar>
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
      initiator: {}
    }
  },
  created() {

    if (this.userId) {
      sourceServices.getSourceById(this.userId)
      .then(response => {
        this.initiator = response.data;
      })
    }
  },
  computed: {

  },
  methods: {

  },
  mixins: [timeHelpers]
}
</script>
