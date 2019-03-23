<template>
    <v-toolbar app color="lime lighten-1">

      <v-toolbar-title @click="goToPage('Home')" class="headline text-uppercase cursor-pointer">
        <span class="font-weight-light">Trustnet</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <content-booster></content-booster>

      <v-divider vertical inset class="mr-3"></v-divider>

      <v-menu v-model="settingsMenu"
        :close-on-content-click="false"
        :nudge-width="120" offset-y left attach>

          <custom-avatar v-if="Object.entries(authUser).length"
            :user="authUser" slot="activator"></custom-avatar>
          <v-card>
            <v-list>

              <template v-for="item in settingItems">
                <v-list-tile :key="item.name" @click="clickHandler(item.name)">

                  <v-list-tile-action v-if="item.icon">
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.name"> </v-list-tile-title>
                  </v-list-tile-content>

                </v-list-tile>
              </template>

          </v-list>
        </v-card>
      </v-menu>

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
      authUser: {},
      settingsMenu: false,
      settingItems: [ {
        name: 'Home', icon: 'home'
      }, {
        name: 'Profile', icon: 'person_outline'
      }, {
        name: 'Settings', icon: 'settings'
      }, {
        name: 'Logout', icon: 'power_settings_new'
      }]
    }
  },
  created() {

    let id = this.$store.getters['auth/user'];
    sourceServices.getSourceById(id).then(response => {
     this.authUser = response.data;
    })
  },
  computed: {

    ...mapGetters('auth', [
     'user'
   ])
 },
 methods: {
   clickHandler: function(item) {
     if (item == 'Home')
      return this.goToPage('/');
     else if (item == 'Profile')
      return this.goToPage('Profile');
     else if (item == 'Settings')
      return this.goToPage('Settings');
     else if (item == 'Logout')
      return this.logout();
   },
   logout: function() {
     this.$store.dispatch('auth/logout')
     .then(() => {
       this.$router.push('/login');
     });
   },
   goToPage: function(page) {
     if (page != 'Profile')
      this.$router.push({ name: page.toLowerCase() });
     else
      this.$router.push({ name: 'profile', params: { username: this.authUser.userName } });
   }
 }
}
</script>

<style scoped>

</style>
