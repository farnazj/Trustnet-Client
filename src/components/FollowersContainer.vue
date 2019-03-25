<template>
  <v-container fluid>

    <v-layout row justify-center>
      <v-flex xs6>
        <v-card-title>
          <v-text-field
            v-model="search" append-icon="search" label="Search followers"
            single-line hide-details></v-text-field>
        </v-card-title>
      </v-flex>
    </v-layout>

    <v-layout row>
      <template>

          <v-container fluid grid-list-xs>
            <v-layout row wrap>
              <v-flex v-for="source in sourceResults"
                :key="source.id" xs3>
                <!-- v-bind="{ [`xs${source.flex}`]: true }"> -->
                  <v-card :color="source.systemMade ? 'blue lighten-4' : 'lime lighten-3'">

                    <v-container fill-height pa-2>
                      <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                          <v-layout row align-end>
                            <custom-avatar :user="source" :clickEnabled="true" class="mr-3"></custom-avatar>
                            <span class="username-text" v-text="source.userName"></span>
                          </v-layout>

                          <v-layout row mt-3>
                            {{sourceDisplayName(source)}}
                          </v-layout>

                        </v-flex>
                      </v-layout>
                    </v-container>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <div v-if="user && source.id == user.id" class="pr-1 pb-2 grey--text text--darken-3 body-2 " >
                        This is you
                      </div>
                      <v-btn v-else-if="!followedIds.includes(source.id)" small flat color="primary" @click="followSource(source)">
                        Follow
                      </v-btn>
                      <v-btn v-else small flat color="secondary" @click="unfollowSource(source)">
                        Unfollow
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

 </v-container>
</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceServices from '@/services/sourceServices'
import sourceHelpers from '@/mixins/sourceHelpers'

import relationServices from '@/services/relationServices'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar
  },
  props: ['username'],
  data () {
    return {
      sourceFollowers: [],
      search: '',
      sourceResults: [],
      limit: 16,
      offset: 0,
      loadDisabled: false
    }
  },
  created(){
    let auth_username = this.user.userName;

    if (auth_username == this.username) {
      this.sourceFollowers = this.followers;
      this.initiateSearch();
    }
    else {
      relationServices.getFollowers({username: this.username})
      .then(res => {
        this.sourceFollowers = res.data;
        this.initiateSearch();
      })
    }

  },
  methods: {
    loadMore: function() {
      let results = this.querySources.slice(this.offset, this.offset + this.limit);

      if (results.length) {
        this.sourceResults.push(...results);
        this.offset += results.length;
      }
      if (results.length < this.limit)
        this.loadDisabled = true;

    },
    followSource: function(source) {
      this.follow({username: source.userName});
    },
    unfollowSource(source) {
      this.unfollow({username: source.userName});
    },
    initiateSearch: function() {
      this.offset = 0;
      this.loadDisabled = false;
      this.sourceResults = this.querySources.slice(this.offset, this.offset + this.limit);
      this.offset += this.sourceResults.length;

      if (this.sourceResults.length < this.limit)
        this.loadDisabled = true;
    },
    ...mapActions('relatedSources', [
      'follow',
      'unfollow',
      'fetchFollowers'
    ])
  },
  computed: {

    querySources: function() {
      return this.sourceFollowers.filter(source => source.userName.includes(this.search)
        || (source.firstName + ' ' + source.lastName).includes(this.search));

    },
    ...mapState('relatedSources', [
     'followers',
     'followed_sources'
   ]),
   ...mapGetters('relatedSources', [
     'followedIds'
   ]),
   ...mapGetters('auth', [
     'user'
   ])
  },
  watch: {
    search (val) {
      this.initiateSearch();
    }
  },
  mixins: [sourceHelpers]
}

</script>

<style scoped>
.username-text {
  font-size: 1.2em;
}

.sth {

}
</style>
