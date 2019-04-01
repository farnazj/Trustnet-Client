<template>
  <v-container fluid class="px-0">

    <photo-upload field="avatar" v-model="showUploader"
        @crop-upload-success="getUser()"
        :noSquare="true"
        :width="400" :height="400"
        url="http://localhost:3000/profile-pictures/"
        :withCredentials="true"
    langType="en">
  </photo-upload>

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

              <v-img :src="profileOwner.photoUrl ? profileOwner.photoUrl : 'https://cdn.vuetifyjs.com/images/cards/kitchen.png'"
              class="profile-img" slot-scope="{ hover }" aspect-ratio="1" width="10"  >
              <v-expand-transition>
                <div v-if="hover && profileOwner.userName == user.userName "
                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal white--text">
                  <v-btn @click="showUploader = true" small flat round dark>
                    <v-icon class ="pl-0 ml-0" right dark>photo_camera</v-icon>
                  </v-btn>
                </div>
              </v-expand-transition>
              </v-img>
            </v-hover>
              </v-layout>

            </v-flex>
            <v-flex xs8>
              <v-card-title>
                <div>
                  <div class="headline grey--text text--lighten-4" v-if="!profileOwner.systemMade">{{profileOwner.firstName}} {{profileOwner.lastName}}</div>
                  <div class="subheading grey--text text--lighten-2">({{profileOwner.userName}})</div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex xs2>

              <v-btn v-if="canBeFollowed" depressed color="primary" @click="followSource()">
                Follow
              </v-btn>
            </v-flex>
          </v-layout>

        </v-container>
      </v-card>
    </v-layout>

    <v-tabs centered color="blue darken-3" dark height=50
      slider-color="amber lighten-1" v-model="tabs" @change="tabChanged">
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
          <boosters-list detailsNamespace="profileArticleDetails"></boosters-list>

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

        <followers-container :username="username"></followers-container>
      </v-tab-item>
    </v-tabs>

  <article-details detailsNamespace="profileArticleDetails"
   filtersNamespace="profileArticles"> </article-details>

  </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'
import articleHolder from '@/components/ArticleHolder'
import articleDetails from '@/components/ArticleDetails'
import assessmentsContainer from '@/components/AssessmentsContainer'
import followersContainer from '@/components/FollowersContainer'
import boostersList from '@/components/BoostersList'
import loading from '@/components/Loading'
import photoUpload from 'vue-image-crop-upload'

import sourceServices from '@/services/sourceServices'
import relationServices from '@/services/relationServices'
import consts from '@/services/constants'
import utils from '@/services/utils'
import { mapState, mapGetters, mapActions } from 'vuex'


export default {
  components: {
    'custom-toolbar': customToolbar,
    'article-holder': articleHolder,
    'article-details': articleDetails,
    'assessments-container': assessmentsContainer,
    'boosters-list': boostersList,
    'followers-container': followersContainer,
    'loading': loading,
    'photo-upload': photoUpload
  },
  props: ['username'],
  data () {
    return {
      profileOwner: {},
      tabs: null,
      showUploadForm: false,
      showUploader: false
    }
  },
  created() {
    this.fetchFollows();
    this.fetchTrusteds()
    this.getUser();
  },
  computed: {
    canBeFollowed: function() {
      if (this.profileOwner && (this.profileOwner.userName != this.username)
        && !utils.isFollowed(this.profileOwner))
        return true;
      else
        return false;
    },
    ...mapGetters('auth', [
      'user'
    ])

  },
  beforeRouteUpdate (to, from, next) {
    this.getUser();
    next();
  },
  methods: {
    getUser: function() {

      sourceServices.getSourceByUsername(this.username)
      .then(user => {
        if (user.data) {
          this.setUsername(this.username);

          this.profileOwner = user.data;
          if (this.profileOwner.photoUrl)
            this.profileOwner.photoUrl = consts.baseURL + '/' + this.profileOwner.photoUrl;
        }
        else {
          this.$router.push({ name: 'invalid' });
        }

      })
      .catch(err => {
        console.log(err);
      })

    },
    tabChanged: function(val) {
      if (val == 0)
        this.scrollDisabled = false;
      else if (val == 1)
      this.scrollDisabled = true;
    },
    followSource: function() {
      this.follow({username: this.profileOwner.userName});
    },
    ...mapActions('profileArticles', [
      'setUsername'
    ]),
    ...mapActions('relatedSources', [
      'follow',
      'fetchFollows',
      'fetchTrusteds'
    ])
  },
  watch: {
    username: function(val) {
      this.getUser();
    }
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
