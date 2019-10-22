<template>

  <v-row class="parent-height" >
    <v-col cols="12">
    <v-row class="pa-4" >
      <v-col cols="6">
        <v-text-field
          v-model="search" append-icon="search" label="Search sources you trust or follow"
          single-line hide-details></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <template>

          <v-container fluid grid-list-xs>
            <v-row wrap>
              <v-col v-for="source in sourceResults"
                :key="source.id" sm="4" lg="3" xl="2" cols="6">

                <source-card :source="source"></source-card>

              </v-col>
            </v-row>
          </v-container>

      </template>
    </v-row>

    <v-row justify="center" v-if="sourceResults.length">
      <v-btn depressed @click="loadMore"
       :disabled="loadDisabled" color="primary" >
        Load More
      </v-btn>
    </v-row>
  </v-col>
 </v-row>
</template>

<script>
import sourceCard from '@/components/SourceCard'
import loadMore from '@/mixins/loadMore'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
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
    querySources: function() {
      let search_l = this.search.toLowerCase();

      return new Promise((resolve, reject) => {
        let filtered_sources = this.followedOrTrusteds.filter(source => {

          let full_name = source.systemMade ? '' : source.firstName + ' ' + source.lastName;
          return source.userName.toLowerCase().includes(search_l) ||
            full_name.toLowerCase().includes(search_l);
        });
        let sliced_sources = filtered_sources.slice(this.offset, this.offset + this.limit);
        resolve({data: sliced_sources});
      });
    },
    ...mapActions('relatedSources', [
      'fetchFollows',
      'fetchTrusteds'
    ])
  },
  watch: {
    // followedOrTrusteds: function(val) {
    //   this.initiateSearch()
    // }
  },
  mixins: [loadMore]

}
</script>
