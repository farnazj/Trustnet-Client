<template>
  <v-layout >
    <v-flex xs12>
    <v-layout row class="pa-4" >
      <v-flex xs6>
        <v-text-field
          v-model="search" append-icon="search" label="Search sources you do not follow yet"
          single-line hide-details></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row>
      <template>

          <v-container fluid grid-list-xs>
            <v-layout row wrap>
              <v-flex v-for="source in sourcesToFollow"
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
        {limit: this.limit, offset: this.offset},
        {searchterm: this.search}
      )
    },
    setupSourcestoFollow: function() {
      let auth_user_id = this.$store.getters['auth/user'].id;
      this.sourcesToFollow = this.sourceResults.filter(source => (!this.followedIds.includes(source.id)
        && source.id != auth_user_id));

    }
  },
  computed: {
    // sourcesToFollow: function() {
    //   let auth_user_id = this.$store.getters['auth/user'].id;
    //   let filtered_sources = this.sourceResults.filter(source => (!this.followedIds.includes(source.id)
    //     && source.id != auth_user_id));
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
