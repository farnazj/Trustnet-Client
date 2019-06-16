<template>

    <v-card :color="source.systemMade ? 'blue lighten-4' : 'lime lighten-3'" class="ma-1">

      <v-container fill-height pa-2>
        <v-layout fill-height row>
          <v-flex xs align-end flexbox>
            <v-layout row align-end>
              <custom-avatar :user="source" :clickEnabled="true" class="mr-3"></custom-avatar>
              <span class="body-2" v-text="source.userName"></span>
            </v-layout>

            <v-layout row mt-2 class="body-2">
              {{sourceDisplayName(source)}}
            </v-layout>

          </v-flex>
          <v-flex xs>
            <v-layout justify-end mb-0>
              <span class="caption trusted-text" v-if="isTrusted"> Trusted &#x2713;</span>
            </v-layout>

            <v-layout justify-end>
              <span class="caption followed-text" v-if="isFollowed"> Followed &#x2713;</span>
            </v-layout>

          </v-flex>
        </v-layout>

      </v-container>

      <v-card-actions>
        <v-layout row v-if="user && source.id == user.id" class="pr-1 pb-2 grey--text text--darken-3 caption" >
          This is you
        </v-layout>

        <v-layout row v-else>

          <v-btn small text :color="isTrusted ? 'grey darken-2' : 'light-green darken-3' "
            @click.stop="changeTrustStatus(source)" class="custom-btn-text">
            <span v-if="isTrusted"> Untrust</span>
            <span v-else> Trust</span>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn small text :color="isFollowed ? 'grey darken-2' : 'primary' "
            @click.stop="changeFollowStatus(source)" class="custom-btn-text">
            <span v-if="isFollowed"> Unfollow</span>
            <span v-else> Follow</span>
          </v-btn>

        </v-layout>

      </v-card-actions>
    </v-card>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceHelpers from '@/mixins/sourceHelpers'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'custom-avatar': customAvatar,
  },
  props: {
    source: {
      required: true
    },
    user: {
      required: false
    }
  },
  data () {
    return {

    }
  },
  computed: {

   ...mapGetters('relatedSources', [
     'trustedIds',
     'followedIds'
   ])
  },
  methods: {
    changeTrustStatus(source) {

      if (!this.trustedIds.includes(source.id)) {
        this.addTrusted({username: source.userName});
      }
      else
        this.deleteTrusted({username: source.userName});
    },
    changeFollowStatus(source) {
      if (!this.followedIds.includes(source.id))
        this.follow({username: source.userName});
      else
        this.unfollow({username: source.userName});
    },
    ...mapActions('relatedSources', [
      'addTrusted',
      'deleteTrusted',
      'follow',
      'unfollow'
    ])
  },
  mixins: [sourceHelpers]

}

</script>
<style>
.trusted-text {
  color: #1B5E20;
}

.followed-text {
  color: #0D47A1;
}

.custom-btn-text {
  font-size: 0.8rem !important;
}

</style>
