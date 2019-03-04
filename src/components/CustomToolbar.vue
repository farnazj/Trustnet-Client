<template>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">Trustnet</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <content-booster></content-booster>

      <v-divider vertical inset class="mr-3"></v-divider>
      <custom-avatar v-if="Object.entries(authUser).length"
        :user="authUser"></custom-avatar>

    </v-toolbar>
</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import contentBooster from '@/components/ContentBooster'
import sourceServices from '@/services/sourceServices'
import { mapGetters } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar,
   'content-booster': contentBooster
  },
  data () {
    return {
      authUser: {}
    }
  },
  computed: {

    ...mapGetters('auth', [
     'user'
   ])
 },
 created() {

   let id = this.$store.getters['auth/user'];
   sourceServices.getSourceById(id).then(response => {
    this.authUser = response.data;
   })
 }
}
</script>

<style scoped>

</style>
