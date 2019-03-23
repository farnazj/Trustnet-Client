<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row class="pt-5" >
      <v-card width="100%" color="secondary">
        <v-container fluid>

          <v-layout row align-end>
            <v-flex xs2>

              <v-layout row justify-center>
              <v-hover>

              <v-img :src="user.photoUrl ? user.photoUrl : 'https://cdn.vuetifyjs.com/images/cards/kitchen.png'"
              class="profile-img" slot-scope="{ hover }" aspect-ratio="1" width="10"  >
              <v-expand-transition>
                <div v-if="hover"
                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal white--text">
                  <v-btn small flat round dark>
                    <v-icon class ="pl-0 ml-0" right dark>photo_camera</v-icon>
                  </v-btn>
                </div>
              </v-expand-transition>
              </v-img>
            </v-hover>
              </v-layout>

            </v-flex>
            <v-flex xs10>
              <v-card-title>
                <div>
                  <div class="headline grey--text text--lighten-4" v-if="!user.systemMade">{{user.firstName}} {{user.lastName}}</div>
                  <div class="subheading grey--text text--lighten-2">({{user.userName}})</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>

        </v-container>
      </v-card>
    </v-layout>

    <v-tabs centered color="blue darken-3" dark height=50
      slider-color="amber lighten-1" v-model="tabs">
      <v-tab >
        <v-icon class="mr-1">list</v-icon>
        Activity List
      </v-tab>

      <v-tab >
        <v-icon class="mr-1">people</v-icon>
        Followers
      </v-tab>

      <v-tab-item>
        <v-container fluid class="px-0">
        <v-layout>
          <loading></loading>

          <v-flex xs7 offset-xs2>
            <article-holder detailsNamespace="profileArticleDetails" filtersNamespace="profileArticles"
            assessmentsNamespace="profileAssessments"></article-holder>
          </v-flex>
          <v-flex xs3 class="assessments-container">
            <assessments-container namespace="profileAssessments">
            </assessments-container>
          </v-flex>

        </v-layout>
        </v-container>

      </v-tab-item>
      <v-tab-item>
      </v-tab-item>
    </v-tabs>

  <article-details detailsNamespace="profileArticleDetails"
   filtersNamespace="profileArticles"> </article-details>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
import ArticleHolder from '@/components/ArticleHolder'
import ArticleDetails from '@/components/ArticleDetails'
import AssessmentsContainer from '@/components/AssessmentsContainer'
import Loading from '@/components/Loading'

import sourceServices from '@/services/sourceServices'
import { mapState, mapActions } from 'vuex'


export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'article-holder': ArticleHolder,
    'article-details': ArticleDetails,
    'assessments-container': AssessmentsContainer,
    'loading': Loading
  },
  data () {
    return {
      user: {},
      tabs: null
    }
  },
  props: ['username'],
  created() {
    this.getUser();
  },
  computed: {
    // visible: function() {
    //   return this.$store.state.profileAssessments.visible;
    // }
  },
  beforeRouteUpdate (to, from, next) {
    this.getUser();
    next();
  },
  methods: {
    getUser: function() {
      this.setUsername(this.username);

      sourceServices.getSourceByUsername(this.username)
      .then(user => {
        this.user = user.data;
      })
      .catch(err => {
        console.log(err);
        //do something
      })

    },
    ...mapActions('profileArticles', [
      'setUsername'
    ]),
  }

}
</script>

<style scoped>
.profile-img {
  border-radius: 50%;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.assessments-container {
  position: sticky;
  right: 0px;
  top: 30px;
  width: 22%;
  height: 97vh;
  overflow-y: auto;
}
</style>
