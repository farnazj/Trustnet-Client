<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row class="pa-4">
        <v-col cols="6">
          <v-text-field
            v-model="search" append-icon="search" label="Search sources you do not follow yet"
            single-line hide-details></v-text-field>
        </v-col>
      </v-row>

      <v-row no-gutters class="pt-2">
        <v-container fluid grid-list-xs class="pa-2">
          <v-row wrap no-gutters>
            <v-col v-for="source in sourcesToFollow" sm="4" lg="3" xl="2" cols="6"
              :key="source.id" >
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
import sourceServices from '@/services/sourceServices'
import loadMore from '@/mixins/loadMore'
import { mapGetters } from 'vuex'

export default {
  components: {
   'source-card': sourceCard
  },
  data () {
    return {
      sourcesToFollow: []
    }
  },
  created() {
    this.initiateSearch();
  },
  methods: {
    querySources: function() {
      return sourceServices.getSources(
        {
          limit: this.limit,
          offset: this.offset
        },
        {
          searchterm: this.search,
          followconstraint: 'not followed'
        }
      )
    },
    setupSourcestoFollow: function() {
      let authUserId = this.$store.getters['auth/user'].id;
      this.sourcesToFollow = this.sourceResults.filter(source => (!this.followedIds.includes(source.id)
        && source.id != authUserId));
    }
  },
  computed: {
    // sourcesToFollow: function() {
    //   let authUserId = this.$store.getters['auth/user'].id;
    //   let filtered_sources = this.sourceResults.filter(source => (!this.followedIds.includes(source.id)
    //     && source.id != authUserId));
    //
    //   return filtered_sources;
    // },
    ...mapGetters('relatedSources', [
      'followedIds',
      'trustedIds',
    ])
  },
  watch: {
    sourceResults: function() {
      this.setupSourcestoFollow();
    }
  },
  mixins: [loadMore]
}

</script>

<style scoped>
.username-text {
  font-size: 1.2em;
}
</style>
