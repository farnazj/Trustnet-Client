<template>
  <v-container fluid class="pt-12">

    <custom-toolbar></custom-toolbar>

    <v-row row justify="center" class="padded-text pt-5">
      <h3 class="display-2">The page you requested does not exist. :(</h3>
    </v-row>

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
