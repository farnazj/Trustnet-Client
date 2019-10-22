<template>
  <v-container fluid>

    <v-row justify="center" no-gutters>
      <v-col cols="6">
        <v-card-title>
          <v-text-field
            v-model="search" append-icon="search" label="Search followers"
            single-line hide-details></v-text-field>
        </v-card-title>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-container fluid grid-list-xs>
        <v-row wrap>
          <v-col v-for="source in sourceResults"
            :key="source.id" sm="4" lg="3" xlg="2" cols="6">
            <source-card :source="source" :user="user"></source-card>
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

 </v-container>
</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceServices from '@/services/sourceServices'
import sourceCard from '@/components/SourceCard'
import loadMore from '@/mixins/loadMore'
import utils from '@/services/utils'
import relationServices from '@/services/relationServices'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar,
   'source-card': sourceCard
  },
  props: ['username'],
  data () {
    return {
      sourceFollowers: []
    }
  },
  created(){
    this.populateFollowers();
  },
  methods: {
    populateFollowers: function() {
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
    querySources: function() {
      let search_l = this.search.toLowerCase();
      return new Promise((resolve, reject) => {

      let filtered_sources = this.sourceFollowers.filter(source => source.userName.toLowerCase().includes(search_l)
        || (source.firstName + ' ' + source.lastName).toLowerCase().includes(search_l));

      let sliced_sources = filtered_sources.slice(this.offset, this.offset + this.limit);
      resolve({data: sliced_sources});
      });

    },
    ...mapActions('relatedSources', [
      'fetchFollowers'
    ])
  },
  computed: {

    ...mapState('relatedSources', [
     'followers'
   ]),
   ...mapGetters('relatedSources', [
     'followedIds'
   ]),
   ...mapGetters('auth', [
     'user'
   ])
  },
  watch: {
    username: function(val) {
      this.populateFollowers();
    }
  },
  mixins: [loadMore]
}

</script>

<style scoped>
.username-text {
  font-size: 1.2em;
}

.sth {

}
</style>
