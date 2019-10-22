<template>
  <v-container fluid class="pt-12">
    <custom-toolbar></custom-toolbar>

    <v-row class="pt-5">
      <h5 class="headline">This is an about page</h5>
    </v-row>

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
