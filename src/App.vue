<template>
  <v-app>
    <router-view></router-view>
    <user-stats></user-stats>
  </v-app>
</template>

<script>
import userStats from '@/components/UserStats'
import utils from '@/services/utils'
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
      let statsDelay = utils.getRandomInt(240, 360) * 1000;
      //let statsDelay = utils.getRandomInt(24, 36) * 1000;
      this.planWhenToShow(statsDelay);
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
