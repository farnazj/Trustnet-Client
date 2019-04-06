<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row justify-center class="padded-text">
      <h3 class="display-2">The page you requested does not exist. :(</h3>
    </v-layout>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'

export default {
  components: {
    'custom-toolbar': CustomToolbar
  }
}
</script>

<style scoped>
.padded-text {
  padding-top: 10%;
}
</style>
