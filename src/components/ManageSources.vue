<template>

  <v-row class="parent-height" >
    <v-col cols="12">
    <v-row class="pa-4" >
      <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 6">
        <v-text-field
          v-model="search" append-icon="search" label="Search sources you trust or follow"
          single-line hide-details></v-text-field>
      </v-col>

       <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 6" class="mt-2">

          <v-checkbox v-model="displayedSourceFilters" label="News Media" value="media" 
            dense :class="['filter-checkbox', $vuetify.breakpoint.mdAndUp ? 'ml-8': '']" 
            :hide-details="true" color="blue lighten-2">
          </v-checkbox>
          <v-checkbox v-model="displayedSourceFilters" label="Individual Users" value="users"
            dense class="filter-checkbox ml-4" :hide-details="true">
          </v-checkbox>

        </v-col>
    </v-row>

    <v-row>
      <v-container fluid grid-list-xs>
        <v-row wrap>
          <v-col v-for="source in sourceResults"
            :key="source.id" sm="4" lg="3" xl="2" cols="6">

            <source-card :source="source"></source-card>

          </v-col>
        </v-row>
      </v-container>
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
    let proms = [];

    if (!this.followedSources.length)
      proms.push(this.fetchFollows());
    if (!this.trustedSources.length)
      proms.push(this.fetchTrusteds());

    Promise.all(proms).then( () => this.initiateSearch());

    if (!this.sourceLists.length)
      this.fetchLists();
  },
  computed: {
    ...mapState('relatedSources', [
     'followedSources',
     'trustedSources',
   ]),
   ...mapGetters('relatedSources', [
     'followedOrTrusteds',
     'trustedIds',
     'followedIds'
   ]),
   ...mapState('sourceLists', [
     'sourceLists'
   ])
  },
  methods: {
    querySources: function() {
      let searchLowerCase = this.search.toLowerCase();

       let headers =  {
          searchterm: this.search,
          followconstraint: 'not followed',
        }

      if (this.individualFilterHeader)
        headers.individual = this.individualFilterHeader;


      return new Promise((resolve, reject) => {
        let filteredSources = this.followedOrTrusteds.filter(source => {

          let fullName = source.systemMade ? '' : source.firstName + ' ' + source.lastName;
          
           
          if (this.individualFilterHeader == 'true') {
            if (source.systemMade == 1)
              return false;
          }
          else if (this.individualFilterHeader == 'false') {
            if (!source.systemMade || !source.isVerified )
              return false;
          }

          return source.userName.toLowerCase().includes(searchLowerCase) ||
            fullName.toLowerCase().includes(searchLowerCase);
        });
        let slicedSources = filteredSources.slice(this.offset, this.offset + this.limit);
        resolve({ data: slicedSources });
      });
    },
    ...mapActions('relatedSources', [
      'fetchFollows',
      'fetchTrusteds'
    ]),
    ...mapActions('sourceLists', [
      'fetchLists'
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

<style scoped>
.filter-checkbox {
  display: inline-block;
}

</style>
