<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout class="pt-5" row fill-height >
      <v-flex xs2>
        <v-tabs centered  dark icons-and-text vertical
        icons-and-text slider-color="lime lighten-4" v-model="tabs"
        @change="tabChanged">
          <v-tab href="#manage">
            Manage your sources
          </v-tab>
          <v-tab href="#discover">
            Discover sources
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex xs10>
        <v-tabs-items v-model="tabs">

          <v-tab-item value="manage">
            hi
          </v-tab-item>

          <v-tab-item value="discover">
            hey
          </v-tab-item>

        </v-tabs-items>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    'custom-toolbar': CustomToolbar
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

  }
}
</script>
