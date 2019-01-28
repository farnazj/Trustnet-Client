<template>
  <v-app>
    <custom-toolbar></custom-toolbar>

    <v-content>
      <HelloWorld/>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from '../components/HelloWorld'
import CustomToolbar from '../components/CustomToolbar'

export default {
  name: 'App',
  components: {
    HelloWorld,
    'custom-toolbar': CustomToolbar
  },
  data () {
    return {
      //
    }
  }
}
</script>
