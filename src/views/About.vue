<template>
  <v-container>

    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row class="pt-5">
      <h5 class="headline">This is an about page</h5>
    </v-layout>

  </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'

export default {
  components: {
    'custom-toolbar': customToolbar
  },
  data(){
    return {
    }
  }
}
</script>
