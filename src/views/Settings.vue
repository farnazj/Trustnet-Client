<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout class="pt-5" row fill-height >
      <v-flex xs2>
        <v-tabs centered dark icons-and-text vertical background-color="grey darken-3"
        icons-and-text slider-color="lime lighten-4" v-model="tabs"
        @change="tabChanged">
          <v-tab href="#feeds">
            Feeds
          </v-tab>
          <v-divider></v-divider>
          <v-tab href="#themes">
            Themes
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex xs10>
        <v-tabs-items v-model="tabs" vertical>
          <v-tab-item value="feeds">
            <feed-manager @loading-on="setLoading(true)" @loading-off="setLoading(false)"></feed-manager>
          </v-tab-item>


          <v-tab-item value="themes">
            hey
          </v-tab-item>

        </v-tabs-items>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
import FeedManager from '@/components/FeedManager'
import Loading from '@/components/Loading'
import { mapActions } from 'vuex';

export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'feed-manager': FeedManager,
    'loading': Loading
  },
  data () {
    return {
      tabs: null
    }
  },
  created() {

  },
  computed: {

  },
  methods: {
    tabChanged: function(val) {

    },
    ...mapActions('loader', [
      'setLoading',
    ])
  }

}
</script>
