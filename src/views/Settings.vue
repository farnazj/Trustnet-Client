<template>
  <v-container fluid class="px-0 pt-12">
    <custom-toolbar></custom-toolbar>

    <v-row no-gutters :class="[ {'frozen': !$vuetify.breakpoint.smAndDown}]">
      <v-tabs centered dark icons-and-text :vertical="$vuetify.breakpoint.smAndDown ? false : true"
       background-color="grey darken-3" slider-color="lime lighten-4" v-model="tabs" >
        <v-tab href="#themes">
            Themes
          </v-tab>

          <v-tab href="#consent">
            consent
          </v-tab>
      </v-tabs>
    </v-row>


  <v-row no-gutters justify="center" class="pt-5">
    <v-col cols="10" sm="6" md="4" lg="3">

      <v-tabs-items v-model="tabs">
          <v-tab-item value="themes">

            <v-radio-group v-model="selectedTheme">
              <template v-slot:label>
                <div class="pb-4 body-2">Select the theme you prefer for viewing previews of articles on your feed:</div>
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

        </v-tab-item>

        <v-tab-item value="consent">
          
          <p class="body-2 pt-4">
            {{siteName}} is a research platform intended to help people navigate their information space.
            Do you give us your consent to use your data in our research analyses and subsequent publications?
          </p>

          <v-radio-group v-model="consent" class="mt-1">
            <v-radio label="Yes" :value="true"></v-radio>
            <v-radio label="No" :value="false"></v-radio>
          </v-radio-group>
                
          <p class="body-2">If you have any questions about our research and data collection, feel free to reach us 
            <a href="https://www.csail.mit.edu/person/farnaz-jahanbakhsh" target="_blank">here</a>.</p>
        </v-tab-item>

      </v-tabs-items>
    </v-col>
  </v-row>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
import consts from '@/services/constants'
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    'custom-toolbar': CustomToolbar,
  },
  data () {
    return {
      tabs: null,
      previewThemes: [{
        name: 'Default',
        imageUrl: './images/default-article-preview.png'
      }, {
        name: 'Compact',
        imageUrl: './images/compact-article-preview.png'
      }]
    }
  },
  created: function() {
    this.getUserPreferences();
    this.getUserConsent();
  },
  computed: {
    siteName: function() {
      return consts.SITE_NAME;
    },
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
    consent: {
      get: function() {
        //checks for both null and undefined 
        if (this.userConsent != null) {
          return this.userConsent;
        } 
        else
          return null;         
      },
      set: function(newValue) {
        this.setUserConsent(newValue);
      }
    },
    ...mapState('preferences', [
      'userPreferences'
    ]),
    ...mapState('consent', [
      'userConsent'
    ])
  },
  methods: {
    // tabChanged: function(val) {
    //   //
    // },
    ...mapActions('preferences', [
      'setUserPreferences',
      'getUserPreferences'
    ]),
    ...mapActions('consent', [
      'setUserConsent',
      'getUserConsent'
    ])
  }

}
</script>

<style scoped>
.custom-label {
  max-width: 100%;
}
</style>

