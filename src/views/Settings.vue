<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row>

    </v-layout>


  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
import { mapState } from 'vuex'


export default {
  components: {
    'custom-toolbar': CustomToolbar,
  },
  data () {
    return {
    }
  },
  computed: {

  }
}
</script>


<style scoped>

</style>
