<template>
  <v-container fluid class="pa-0 full-height" >
    <custom-toolbar></custom-toolbar>

    <v-row class="pt-9 parent-height" >
      <v-col cols="12">

        <v-tabs centered dark background-color="grey darken-3" height=36
          slider-color="lime lighten-4" v-model="tabs" @change="tabChanged">
          <v-tab href="#manage" >
            Manage your sources
          </v-tab>

          <v-tab href="#lists">
            Source Lists
          </v-tab>

          <v-tab href="#discover">
            Discover sources
          </v-tab>

          <v-tab href="#addFeeds">
            Add feeds
          </v-tab>

        </v-tabs>

        <v-tabs-items v-model="tabs" class="parent-height light-grey-background">
          <v-tab-item value="manage">
            <manage-sources ref="manage">
            </manage-sources>
          </v-tab-item>

          <v-tab-item value="lists">
            <source-lists-container>
            </source-lists-container>
          </v-tab-item>

          <v-tab-item value="discover">
            <discover-sources ref="discover">
            </discover-sources>
          </v-tab-item>

          <v-tab-item value="addFeeds">
            <v-container fluid class="pa-2">
              <v-row no-gutters>
                <p>
                  Add an RSS feed to the system so that you and other users can hear
                  about its latest content.
                </p>
              </v-row>

              <v-row no-gutters justify="center" class="mb-3">
                <v-col sm="12" md="6" lg="4">
                  <feed-manager @loading-on="setLoading(true)" @loading-off="setLoading(false)"
                    @success-response="showFeed">
                  </feed-manager>
                </v-col>
              </v-row>

              <v-row v-if="showAddedFeed" >
                <v-col v-for="addedSource in addedSources" sm="4" lg="3" xl="2" cols="6"
                  :key="addedSource.id" >
                  <source-card :source="addedSource"></source-card>
                </v-col>
              </v-row>

            </v-container>
          </v-tab-item>
        </v-tabs-items>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
import ManageSources from '@/components/ManageSources'
import sourceListsContainer from '@/components/SourceListsContainer'
import DiscoverSources from '@/components/DiscoverSources'
import FeedManager from '@/components/FeedManager'
import sourceCard from '@/components/SourceCard'
import Loading from '@/components/Loading'

import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'manage-sources': ManageSources,
    'source-lists-container': sourceListsContainer,
    'discover-sources': DiscoverSources,
    'feed-manager': FeedManager,
    'loading': Loading,
    'source-card': sourceCard
  },
  data () {
    return {
      tabs: null,
      addedSources: [],
      showAddedFeed: false
    }
  },
  created() {
    Promise.all([this.fetchFollows(),this.fetchTrusteds()])
    .then(()=> {
      this.presetTab();
    });
  },
  computed: {
    ...mapGetters('relatedSources', [
     'followedOrTrusteds'
    ])
  },
  methods: {
    presetTab: function() {
      if (!this.followedOrTrusteds.length)
        this.tabs = 'discover';
    },
    tabChanged: function(val) {
      if (this.$refs[val])
        this.$refs[val].initiateSearch();
    },
    showFeed: function(returnedSource) {
      let addedSourcesIds = this.addedSources.map(el => el.id);
      if (!addedSourcesIds.includes(returnedSource.id)) {
        this.addedSources.push(returnedSource);

      this.showAddedFeed = true;
      }

    },
    ...mapActions('relatedSources', [
      'fetchFollows',
      'fetchTrusteds'
    ]),
    ...mapActions('loader', [
      'setLoading',
    ])
  }
}
</script>
