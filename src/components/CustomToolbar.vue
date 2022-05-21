<template>
    <v-app-bar dense fixed color="lime lighten-1">

      <v-toolbar-title @click="goToPage('Home')" class="headline text-uppercase interactable">
        <v-img src="logo.png" class="logo-img mr-1"></v-img>
        <span class="font-weight-light">Trustnet</span>
      </v-toolbar-title>

        <v-text-field v-if="isSearchVisible" outlined dense v-on:keyup.enter="searchByURL"
            label="Search for content by URL" class="search-bar ml-6 pt-6" v-model="postURL"
        ></v-text-field>
       
      <v-spacer></v-spacer>

      <template v-if="isLoggedIn" class="center-aligned">

        <content-booster class="mr-2"></content-booster>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" class="mr-2" @click="clickHandler('Sources')"
              color="grey darken-2">
                <v-icon>fas fa-users</v-icon>
              </v-btn>
          </template>
          <span>Sources</span>
        </v-tooltip>


        <notification-panel></notification-panel>

        <v-divider vertical inset class="mr-2"></v-divider>

        <v-menu v-model="settingsMenu"
          :close-on-content-click="false"
          :nudge-width="120" offset-y left attach>

          <template v-slot:activator="{ on: { click } }">
            <custom-avatar v-if="Object.entries(user).length" :size=40 class="mr-1 interactable"
              :user="user" :clickEnabled="false" v-on:click.native="click" ></custom-avatar>
          </template>
          <v-card>
            <v-list dense>
              <template v-for="item in settingItems">
                <v-list-item :key="item.name" @click="clickHandler(item.name)">

                  <v-list-item-action class="my-1" v-if="item.icon">
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title v-html="item.name"> </v-list-item-title>
                  </v-list-item-content>

                </v-list-item>
              </template>
            </v-list>
          </v-card>

        </v-menu>

      </template>

      <template v-else>
         <v-btn @click="goToPage('About')" text>About</v-btn>
      </template>

    </v-app-bar>
</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import contentBooster from '@/components/ContentBooster'
import notificationPanel from '@/components/NotificationPanel'
import sourceServices from '@/services/sourceServices'
import postServices from '@/services/postServices'
import logHelpers from '@/mixins/logHelpers'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar,
   'content-booster': contentBooster,
   'notification-panel': notificationPanel
  },
  data () {
    return {
      authUser: {},
      settingsMenu: false,
      settingItems: [ {
        name: 'Home', icon: 'home'
      }, {
        name: 'Profile', icon: 'person_outline'
      },
      {
        name: 'Settings', icon: 'settings'
      },
      {
        name: 'About', icon: 'help'
      }, {
        name: 'Logout', icon: 'power_settings_new'
      }],
      postURL: ''
    }
  },
  created() {
  },
  computed: {
    isSearchVisible() {
      return this.$route.name == 'home';
    },

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
    else {
      this.logEvent({ type: 'visit_profile', data: this.user.userName });
      this.$router.push({ name: 'profile', params: { username: this.user.userName } });
     }
   },
   searchByURL: function() {
     postServices.getPostByURL({
       url: this.postURL
     })
     .then(res => {
        if (res.data)
          this.$router.push({ name: 'singlePost', params: { postid: res.data.id }})
     })
   }
 },
  mixins: [logHelpers]

}
</script>

<style scoped>

.center-aligned {
  align-items: center;
}

.logo-img {
  display: inline-flex;
  border-radius: 50%;
  vertical-align: middle;
  width: 40px;
}

.search-bar {
  max-width: 25vw;
}
</style>
