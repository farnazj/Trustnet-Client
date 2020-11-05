<template>
  <v-app>
    <router-view></router-view>
    <user-stats></user-stats>
  </v-app>
</template>

<script>
import userStats from '@/components/UserStats'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    'user-stats': userStats
  },
  data () {
    return {
    }
  },
  created() {
      if (this.$store.getters['auth/isLoggedIn']) {
        this.planWhenToShow();
      } 
    
  },
  methods: {
    logout: function () {
      this.$store.dispatch['auth/logout']
      .then(() => {
        this.$router.push('/login');
      })
    },
    ...mapActions('userStats', ['planWhenToShow'])
  }
}
</script>
