<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
//import axios from 'axios'

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
    }
  },
  computed : {
      isLoggedIn : function() {
        return this.$store.getters['auth/isLoggedIn'];
      }
  },
  methods: {
    logout: function () {
      this.$store.dispatch['auth/logout']
      .then(() => {
        this.$router.push('/login');
      })
    }
  }
}
</script>
