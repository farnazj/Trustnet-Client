<template>
  <v-card>

    <v-layout row>
      <v-flex xs6>
        <v-card-title>
          <v-text-field
            v-model="search" append-icon="search" label="Search sources"
            single-line hide-details></v-text-field>
        </v-card-title>
      </v-flex>
    </v-layout>

    <v-layout row>
      <template>

          <v-container fluid grid-list-xs>
            <v-layout row wrap>
              <v-flex v-for="source in sourcesToFollow"
                :key="source.id" xs4>
                <!-- v-bind="{ [`xs${source.flex}`]: true }"> -->
                  <v-card :color="source.systemMade ? 'blue lighten-4' : 'lime lighten-3'">

                    <v-container fill-height pa-2>
                      <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                          <v-layout row align-end>
                            <custom-avatar :user="source" :clickEnabled="true" class="mr-2"></custom-avatar>
                            <span class="username-text" v-text="source.userName"></span>
                          </v-layout>

                          <v-layout row mt-2>
                            {{sourceDisplayName(source)}}
                          </v-layout>

                        </v-flex>
                      </v-layout>
                    </v-container>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn small flat color="primary" @click="followSource(source)">
                        Follow
                      </v-btn>
                    </v-card-actions>
                  </v-card>
              </v-flex>
            </v-layout>
          </v-container>

      </template>

    </v-layout>

    <v-layout row justify-center v-if="sourceResults.length">
      <v-btn depressed @click="loadMore"
       :disabled="loadDisabled" color="primary" >
        Load More
      </v-btn>
    </v-layout>

 </v-card>
</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceServices from '@/services/sourceServices'
import sourceHelpers from '@/mixins/sourceHelpers'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar
  },
  data () {
    return {
      search: '',
      sourceResults: [],
      limit: 12,
      offset: 0,
      loadDisabled: false
    }
  },
  methods: {
    loadMore: function() {
      this.querySources()
      .then(results =>{
        if (results.data.length) {
          this.sourceResults.push(...results.data);
          this.offset += results.data.length;
        }
        if (results.data.length < this.limit)
          this.loadDisabled = true;

      })
    },
    querySources: function() {
      return sourceServices.getSources(
        {limit: this.limit, offset: this.offset},
        {search_term: this.search}
      )
    },
    followSource: function(source) {
      this.follow({username: source.userName});
    },
    ...mapActions('relatedSources', [
      'follow'
    ])
  },
  computed: {
    sourcesToFollow: function() {
      let auth_user_id = this.$store.getters['auth/user'].id;
      return this.sourceResults.filter(source => (!this.followedIds.includes(source.id)
        && source.id != auth_user_id));
    },
    ...mapState('relatedSources', [
     'followed_sources'
    ]),
    ...mapGetters('relatedSources', [
      'followedIds'
    ])
  },
  watch: {
    search (val) {
      this.offset = 0;
      this.loadDisabled = false;
      this.querySources()
      .then(results => {
        this.sourceResults = results.data;
        this.offset += results.data.length;

        if (results.data.length < this.limit)
          this.loadDisabled = true;
      })
    }
  },
  mixins: [sourceHelpers]
}

</script>

<style scoped>
.username-text {
  font-size: 1.2em;
}
</style>
