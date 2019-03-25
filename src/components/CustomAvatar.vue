<template>

  <span v-on="clickEnabled ? { click: goToPage } : {}" class="[clickEnabled ? cursor-pointer : '']">
      <v-badge v-if="isTrusted === true"
        overlap color="blue lighten-3" bottom >
        <template slot="badge" >
          <span>T</span>
        </template>
        <inner-avatar :user="user" :size="size"></inner-avatar>
      </v-badge>

      <inner-avatar v-else :user="user" :size="size">
      </inner-avatar>
  </span>

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
    },
    clickEnabled: {
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isTrusted: function() {
      return utils.isTrusted(this.user);
    },
    ...mapState('relatedSources', [
      'trusted_sources'
    ])
  },
  methods: {
    goToPage: function(event) {
      event.stopPropagation();
      this.$router.push({ name: 'profile', params: { username: this.user.userName } });
    }
  }

}
</script>

<style scoped>
.trust-badge {
}
</style>
