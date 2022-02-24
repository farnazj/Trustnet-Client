<template>

  <span v-on="clickEnabled ? { click: goToPage } : {}" :class="[clickEnabled ? 'interactable' : '', 'reset-font']">
    <v-badge v-if="isTrusted === true"
      overlap color="" bottom icon="shield">
      <!-- <template v-slot:badge >
        <span class="reset-line-height">T</span>
      </template> -->
      <inner-avatar :user="user" :size="size ? size : avatarSize"></inner-avatar>
    </v-badge>

    <inner-avatar v-else :user="user" :size="size ? size : avatarSize">
    </inner-avatar>
  </span>

</template>

<script>
import innerAvatar from '@/components/InnerAvatar'
import logHelpers from '@/mixins/logHelpers'
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
    avatarSize: function() {
      return 30;
    },
    isTrusted: function() {
      return utils.isTrusted(this.user);
    },
    ...mapState('relatedSources', [
      'trustedSources'
    ])
  },
  methods: {
    goToPage: function(event) {
      event.stopPropagation();
      this.logEvent({ type: 'visit_profile', data: this.user.userName });
      let route = this.$router.resolve({ name: 'profile', params: { username: this.user.userName } });
      window.open(route.href);
    }
  },
  mixins: [logHelpers]

}
</script>

<style scoped>
.reset-font {
  font-size: initial;
}
.custom-badge {
  line-height: initial;
}
</style>
