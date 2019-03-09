<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout class="pt-5" row justify-center align-center fill-height >
      <v-flex xs9>
        <v-tabs left color="blue darken-1" dark
          slider-color="amber lighten-1" v-model="tabs">
          <v-tab >
            Manage your sources
          </v-tab>
          <v-tab>
            Discover sources
          </v-tab>

          <v-tab-item>
            <manage-sources>
            </manage-sources>
          </v-tab-item>

          <v-tab-item>
            <discover-sources>
            </discover-sources>
          </v-tab-item>

        </v-tabs>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
import ManageSources from '@/components/ManageSources'
import DiscoverSources from '@/components/DiscoverSources'

export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'manage-sources': ManageSources,
    'discover-sources': DiscoverSources
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

  }
}
</script>


<style scoped>

</style>
