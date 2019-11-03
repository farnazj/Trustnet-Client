<template>
  <v-container fluid class="px-0 pt-12">
    <custom-toolbar></custom-toolbar>

    <v-row no-gutters :class="['pt-3', {'frozen': !$vuetify.breakpoint.smAndDown}]">
      <v-tabs centered dark icons-and-text :vertical="$vuetify.breakpoint.smAndDown ? false : true"
       background-color="grey darken-3" slider-color="lime lighten-4" v-model="tabs" @change="tabChanged">
        <v-tab href="#feeds">
          Feeds
        </v-tab>
        <v-divider></v-divider>
        <v-tab href="#themes">
          Themes
        </v-tab>
      </v-tabs>
    </v-row>

    <v-row class="pt-5" fill-height no-gutters>

      <v-col cols="12"  >
        <v-row no-gutters justify="center">
        <v-tabs-items v-model="tabs" :vertical="$vuetify.breakpoint.smAndDown ? false : true" >
          <v-tab-item value="feeds">
            <feed-manager @loading-on="setLoading(true)" @loading-off="setLoading(false)"></feed-manager>
          </v-tab-item>

          <v-tab-item value="themes">
            this section has not been added yet.
          </v-tab-item>

        </v-tabs-items>
      </v-row>
      </v-col>
    </v-row>

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
  methods: {
    tabChanged: function(val) {
      //
    },
    ...mapActions('loader', [
      'setLoading',
    ])
  }

}
</script>
