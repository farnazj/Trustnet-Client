<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>

import axios from 'axios'
export default {

  name: 'App',
  components: {
  },
  data () {
    return {
      //
    }
  },
  mounted() {


  },
  computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    },
}
</script>
