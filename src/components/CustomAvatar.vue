<template>

  <v-badge overlap color="blue lighten-3" bottom v-if="isTrusted === true">
    <template slot="badge" >
      <span>T</span>
    </template>
    <inner-avatar :user="user" :size="size"></inner-avatar>
  </v-badge>

  <inner-avatar v-else :user="user" :size="size"></inner-avatar>

</template>

<script>
import innerAvatar from '@/components/InnerAvatar'
import utils from '@/services/utils'
import { mapState } from 'vuex';

export default {
  components: {
    'inner-avatar': innerAvatar
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      isTrusted: false
    }
  },
  created() {

    this.setTrustStatus();
    //build the href for avatar
  },
  computed: {
    ...mapState('relatedSources', [
      'trusted_sources'
    ])
  },
  methods: {
    goToPage: function(event) {

    },
    setTrustStatus: function() {
      utils.isTrusted(this.user)
      .then(trustStatus => {
        this.isTrusted = trustStatus;
      })
    }
  },
  watch: {
    //state.trusted_sources
    trusted_sources: function(val) {
      this.setTrustStatus();
    }
  }

}
</script>

<style scoped>
.trust-badge {
}
</style>
