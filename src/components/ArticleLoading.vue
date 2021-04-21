<template>
<!-- 
  <v-dialog v-model="loading"
    hide-overlay persistent width="300">
    <v-card color="primary" dark>
      <v-card-text>
        <slot>
          Loading
        </slot>
        <v-progress-linear indeterminate color="white"
        class="mb-0 mt-1">
        </v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog> -->

    <v-row no-gutters class="mt-3" >
      <v-col cols="3" class="pa-0">
        <v-skeleton-loader height="100%" class="mx-auto" :type="defaultView ? 'card-avatar' : 'list-item-avatar'"
        ></v-skeleton-loader>
        </v-col>  
        <v-col cols="9" class="pa-0">
          <v-skeleton-loader height="100%" class="mx-auto" type="article"
          ></v-skeleton-loader>
      </v-col>
    </v-row>
    

</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
    }
  },
  computed: {
    defaultView: function() {
      return typeof this.userPreferences.articlePreviewTheme === 'undefined' || this.userPreferences.articlePreviewTheme === 'default';
    },
    ...mapState('preferences', [
      'userPreferences'
    ]),
    ...mapState('loader', [
      'loading'
    ])
  }

}
</script>