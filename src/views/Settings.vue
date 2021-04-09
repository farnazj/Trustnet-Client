<template>
  <v-container fluid class="px-0 pt-12">
    <custom-toolbar></custom-toolbar>

    <!-- <v-row no-gutters :class="['pt-3', {'frozen': !$vuetify.breakpoint.smAndDown}]">
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

      <v-col cols="12" >
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
    </v-row> -->

  <v-row no-gutters justify="center" class="pt-5">
    <v-col cols="10" sm="6" md="4" lg="3">

      <v-radio-group v-model="selectedTheme">
        <template v-slot:label>
          <div>Select the theme you prefer for viewing previews of articles on your feed:</div>
        </template>
        <v-radio v-for="(theme, index) in previewThemes" :key="index"
          :value="theme.name" >
          <template v-slot:label>
            <v-row no-gutters class="custom-label mb-2" >
              <v-col cols="12">
                <v-row no-gutters>{{theme.name}}</v-row>
                <v-row no-gutters>
                  <v-img :contain="true" :src="theme.imageUrl"></v-img>
                </v-row>
              </v-col>
              
            </v-row>
          </template>
        </v-radio>
      </v-radio-group>

    </v-col>
  </v-row>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
// import FeedManager from '@/components/FeedManager'
// import Loading from '@/components/Loading'
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    'custom-toolbar': CustomToolbar,
    // 'feed-manager': FeedManager,
    // 'loading': Loading
  },
  data () {
    return {
      previewThemes: [{
        name: 'Default',
        imageUrl: './images/default-article-preview.png'
      }, {
        name: 'Compact',
        imageUrl: './images/compact-article-preview.png'
      }]
    }
  },
  computed: {
    selectedTheme: {
      get: function() {
        if (typeof this.userPreferences.articlePreviewTheme === 'undefined' || this.userPreferences.articlePreviewTheme === 'default')
          return 'Default';
        else
          return 'Compact';
      },
      set: function(newValue) {
        this.setUserPreferences({ articlePreviewTheme: newValue.toLowerCase() });
      }
    },
    ...mapState('preferences', [
      'userPreferences'
    ])
  },
  methods: {
    // tabChanged: function(val) {
    //   //
    // },
    ...mapActions('preferences', [
      'setUserPreferences',
    ])
  }

}
</script>

<style scoped>
.custom-label {
  max-width: 100%;
}
</style>

