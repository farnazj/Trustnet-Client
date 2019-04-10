<template>
    <v-toolbar app color="lime lighten-1">

      <v-toolbar-title @click="goToPage('Home')" class="headline text-uppercase cursor-pointer">
        <span class="font-weight-light">Trustnet</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="isLoggedIn" class="center-aligned">

        <content-booster></content-booster>

        <v-divider vertical inset class="mr-3"></v-divider>

        <v-menu v-model="settingsMenu"
          :close-on-content-click="false"
          :nudge-width="120" offset-y left attach>

            <custom-avatar v-if="Object.entries(user).length"
              :user="user" :clickEnabled="false" slot="activator" ></custom-avatar>
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

      </v-toolbar-items>

      <v-toolbar-items v-else>
         <v-btn @click="goToPage('About')" flat>About</v-btn>
      </v-toolbar-items>

    </v-toolbar>
</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import contentBooster from '@/components/ContentBooster'
import sourceServices from '@/services/sourceServices'
import { mapState, mapGetters } from 'vuex'

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
        name: 'Sources', icon: 'account_circle'
      }, {
        name: 'Logout', icon: 'power_settings_new'
      }]
    }
  },
  created() {
  },
  computed: {

    ...mapGetters('auth', [
     'user',
     'isLoggedIn'
   ])
 },
 methods: {

   clickHandler: function(item) {
    if (item == 'Logout')
      return this.logout();
    else
      return this.goToPage(item);
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
      this.$router.push({ name: 'profile', params: { username: this.user.userName } });
   }
 }
}
</script>

<style scoped>

.center-aligned {
    align-items: center;
}
</style>
