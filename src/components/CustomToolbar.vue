<template>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">Trustnet</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <custom-avatar :user="user"></custom-avatar>

    </v-toolbar>
</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import { mapGetters } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar
  },
  data () {
    return {
    }
  },
  computed: {

    ...mapGetters('auth', [
     'user'
   ])
  }
}
</script>
