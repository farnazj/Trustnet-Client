<template>

  <v-layout >
    <v-flex xs12>
    <v-layout row class="pa-4" >
      <v-flex xs6>
        <v-text-field
          v-model="search" append-icon="search" label="Search sources you trust or follow"
          single-line hide-details></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row>
      <template>

          <v-container fluid grid-list-xs>
            <v-layout row wrap>
              <v-flex v-for="source in sourceResults"
                :key="source.id" xs3>

                <source-card :source="source"></source-card>

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
  </v-flex>
 </v-layout>
</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceCard from '@/components/SourceCard'
import loadMore from '@/mixins/loadMore'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'custom-avatar': customAvatar,
    'source-card': sourceCard
  },
  data () {
    return {
    }
  },
  created() {
    if (!this.followed_sources.length)
      this.fetchFollows();
    if (!this.trusted_sources.length)
      this.fetchTrusteds();

    this.initiateSearch();

  },
  computed: {
    ...mapState('relatedSources', [
     'followed_sources',
     'trusted_sources',
   ]),
   ...mapGetters('relatedSources', [
     'followedOrTrusteds',
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
    querySources: function() {
      return new Promise((resolve, reject) => {
        let search_l = this.search.toLowerCase();

        let filtered_sources = this.followedOrTrusteds.filter(source => {

          let full_name = source.systemMade ? '' : source.firstName + ' ' + source.lastName;
          return source.userName.toLowerCase().includes(search_l) ||
            full_name.toLowerCase().includes(search_l);
        })
        let sliced_sources = filtered_sources.slice(this.offset, this.offset + this.limit);
        resolve({data: sliced_sources});
      });
    },
    ...mapActions('relatedSources', [
      'fetchFollows',
      'fetchTrusteds',
      'addTrusted',
      'deleteTrusted',
      'follow',
      'unfollow'
    ])
  },
  watch: {
    followedOrTrusteds: function(val) {
      this.initiateSearch()

    }
  },
  mixins: [loadMore]

}
</script>
