<template>

    <v-card :color="source.systemMade ? 'blue lighten-4' : 'lime lighten-3'" class="ma-1">

      <v-container fill-height pa-2>
        <v-row fill-height no-gutters>

          <v-col cols="9" >
            <v-row align="end" no-gutters >
              <v-col cols="3">
                <custom-avatar :user="source" :clickEnabled="true" :size="34" class="mr-3"></custom-avatar>
              </v-col>
              <v-col cols="9">
                <span class="body-2 name-container">
                  <v-tooltip bottom open-delay="500">
                    <template v-slot:activator="{ on }">
                      <span v-on="on">{{source.userName}}</span>
                    </template>
                    <span>{{source.userName}}</span>
                  </v-tooltip>
                </span>
              </v-col>
            </v-row>

            <v-row no-gutters class="body-2 mt-2 name-container">
              <v-tooltip bottom open-delay="500">
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{sourceDisplayName(source)}}</span>
                </template>
                <span>{{sourceDisplayName(source)}}</span>
              </v-tooltip>
            </v-row>
          </v-col>

          <v-col>
            <v-row no-gutters justify="end" class="mb-0">
              <span class="caption trusted-text" v-if="isTrusted"> Trusted &#x2713;</span>
            </v-row>

            <v-row no-gutters justify="end">
              <span class="caption followed-text" v-if="isFollowed"> Followed &#x2713;</span>
            </v-row>
          </v-col>

        </v-row>
      </v-container>

      <v-card-actions class="pb-1 px-0">
        <v-row v-if="user && source.id == user.id" no-gutters class="px-2 pb-2 grey--text text--darken-3 caption" >
          This is you
        </v-row>

        <v-row v-else no-gutters align="end">

          <v-btn small text :color="isTrusted ? 'grey darken-2' : 'light-green darken-3' "
            @click.stop="changeTrustStatus(source)" class="custom-btn-text">
            <span v-if="isTrusted"> Untrust</span>
            <span v-else> Trust</span>
          </v-btn>

          <v-btn small text :color="isFollowed ? 'grey darken-2' : 'primary' "
            @click.stop="changeFollowStatus(source)" class="custom-btn-text ">
            <span v-if="isFollowed"> Unfollow</span>
            <span v-else> Follow</span>
          </v-btn>

          <v-spacer></v-spacer>

          <v-menu :close-on-content-click=false offset-y min-width=150>
            <template v-slot:activator="{ on }">
              <v-btn text x-small color="grey darken-3" v-on="on">
                <v-icon >mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-subheader>Add to lists</v-subheader>

             <source-list-line v-for="(list, index) in sourceLists" :key="index"
                :source="source" :list="list">
             </source-list-line>

            </v-list>
          </v-menu>

        </v-row>

      </v-card-actions>

    </v-card>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceListLine from '@/components/SourceListLine'
import sourceHelpers from '@/mixins/sourceHelpers'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'custom-avatar': customAvatar,
    'source-list-line': sourceListLine
  },
  props: {
    source: {
      required: true
    },
    user: {
      required: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState('sourceLists', [
      'sourceLists'
    ]),
   ...mapGetters('relatedSources', [
     'trustedIds',
     'followedIds'
   ])
  },
  methods: {
    changeTrustStatus(source) {

      if (!this.trustedIds.includes(source.id)) {
        this.addTrusted({ username: source.userName });
      }
      else
        this.deleteTrusted({ username: source.userName });
    },
    changeFollowStatus(source) {

      if (!this.followedIds.includes(source.id))
        this.follow({ username: source.userName });
      else
        this.unfollow({ username: source.userName });
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

<style scoped>

.trusted-text {
  color: #1B5E20;
}

.followed-text {
  color: #0D47A1;
}

.custom-btn-text {
  font-size: 0.8rem !important;
}

.name-container {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
