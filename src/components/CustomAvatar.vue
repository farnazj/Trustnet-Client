<template>

  <span v-on="clickEnabled ? { click: goToPage } : {}" :class="[clickEnabled ? 'interactable' : '', 'reset-font']">
    <v-badge v-if="isTrusted === true"
      overlap color="blue lighten-3 custom-badge" bottom content="T">
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
      this.$router.push({ name: 'profile', params: { username: this.user.userName } });
    }
  }

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
