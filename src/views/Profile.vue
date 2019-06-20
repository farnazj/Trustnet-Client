<template>
  <v-container fluid class="px-0">

    <photo-upload field="avatar" v-model="showUploader"
        @crop-upload-success="updateAuthUser()"
        :noSquare="true"
        :width="400" :height="400"
        :url="uploadUrl"
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
            <v-flex sm2 xs4>

              <v-layout row justify-center>

              <v-hover>

              <v-img :src="profileOwner.photoUrl ? profileOwner.photoUrl : 'https://api.adorable.io/avatars/249/farnaz.png'"
              class="profile-img" slot-scope="{ hover }" aspect-ratio="1" width="10"  >
              <v-expand-transition>
                <div v-if="hover && profileOwner.userName == user.userName "
                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal white--text">
                  <v-btn @click="showUploader = true" small text rounded dark>
                    <v-icon class ="pl-0 ml-0" right dark>photo_camera</v-icon>
                  </v-btn>
                </div>
              </v-expand-transition>
              </v-img>
            </v-hover>
              </v-layout>

            </v-flex>
            <v-flex sm7 xs5>
              <v-card-title>
                <div>
                  <div class="headline grey--text text--lighten-4" v-if="!profileOwner.systemMade">{{profileOwner.firstName}} {{profileOwner.lastName}}</div>
                  <div class="subheading grey--text text--lighten-2">({{profileOwner.userName}})</div>
                </div>
              </v-card-title>
            </v-flex>

            <v-flex xs3>

              <v-layout row v-if="notUser" justify-end wrap>
                <v-btn :small="$vuetify.breakpoint.xsOnly" depressed @click="changeTrustStatus()"
                :color="isTrusted ? 'grey lighten-1' : 'light-green lighten-1' " class="ma-1">
                  <span v-if="!isTrusted">Trust</span>
                  <span v-else>Untrust</span>
                </v-btn>

                <v-btn :small="$vuetify.breakpoint.xsOnly" depressed @click="changeFollowStatus()"
                :color="isFollowed ? 'grey lighten-1' : 'primary' " class="ma-1">
                  <span v-if="!isFollowed">Follow</span>
                  <span v-else>Unfollow</span>
                </v-btn>
              </v-layout>

            </v-flex>
          </v-layout>

        </v-container>
      </v-card>
    </v-layout>

    <v-tabs centered background-color="blue darken-3" height=50 v-model="tabs"
      slider-color="amber lighten-1" dark>
      <v-tab >
        <v-icon class="mr-1">list</v-icon>
        Activity List
      </v-tab>

      <v-tab >
        <v-icon class="mr-1">people</v-icon>
        Followers
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-container fluid class="px-0">
        <v-layout>
          <loading></loading>
          <boosters-list detailsNamespace="profileArticleDetails"></boosters-list>
          <assessment-history namespace="profileAssessments"></assessment-history>

          <v-flex xs7>
            <article-holder detailsNamespace="profileArticleDetails" filtersNamespace="profileArticles"
            assessmentsNamespace="profileAssessments"></article-holder>
          </v-flex>

          <assessments-container namespace="profileAssessments" class="assessments-container">
          </assessments-container>

        </v-layout>
        </v-container>

      </v-tab-item>
      <v-tab-item>

        <followers-container :username="username"></followers-container>
      </v-tab-item>
    </v-tabs-items>

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
import assessmentHistory from '@/components/AssessmentHistory'
import loading from '@/components/Loading'
import photoUpload from 'vue-image-crop-upload'

import sourceServices from '@/services/sourceServices'
import consts from '@/services/constants'
import utils from '@/services/utils'
import { mapGetters, mapActions } from 'vuex'


export default {
  components: {
    'custom-toolbar': customToolbar,
    'article-holder': articleHolder,
    'article-details': articleDetails,
    'assessments-container': assessmentsContainer,
    'boosters-list': boostersList,
    'assessment-history': assessmentHistory,
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
    this.setUsername(this.username);
    this.fetchFollows();
    this.fetchTrusteds()
    this.getUser();
  },
  computed: {
    uploadUrl: function() {
      return consts.baseURL + '/profile-pictures/';
    },
    notUser: function() {

      if (this.user && (this.profileOwner.userName != this.user.userName))
        return true;
      else
        return false;
    },
    isFollowed: function() {
      return utils.isFollowed(this.profileOwner);
    },
    isTrusted: function() {
      return utils.isTrusted(this.profileOwner);
    },
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapGetters('relatedSources', [
      'trustedIds',
      'followedIds'
    ])

  },
  beforeRouteUpdate (to, from, next) {
    this.getUser();
    next();
  },
  beforeRouteLeave (to, from, next) {
    this.hideContainer();
    next();
  },
  methods: {
    updateAuthUser: function() {
      this.updateUser();
      this.getUser();
    },
    getUser: function() {

      sourceServices.getSourceByUsername(this.username)
      .then(user => {
        if (user.data) {
          this.setUsername(this.username);

          this.profileOwner = user.data;
          if (this.profileOwner.photoUrl) {
            if (this.profileOwner.photoUrl.includes('http'))
              this.profileOwner.photoUrl =  this.profileOwner.photoUrl;
            else
              this.profileOwner.photoUrl = consts.baseURL + '/' + this.profileOwner.photoUrl;
          }

        }
        else {
          this.$router.push({ name: 'invalid' });
        }

      })
      .catch(err => {
        console.log(err);
      })

    },
    changeTrustStatus() {
      let source = this.profileOwner;
      if (!this.trustedIds.includes(source.id)) {
        this.addTrusted({username: source.userName});
      }
      else
        this.deleteTrusted({username: source.userName});
    },
    changeFollowStatus() {
      let source = this.profileOwner;
      if (!this.followedIds.includes(source.id))
        this.follow({username: source.userName});
      else
        this.unfollow({username: source.userName});
    },
    ...mapActions('profileArticles', [
      'setUsername'
    ]),
    ...mapActions('relatedSources', [
      'addTrusted',
      'deleteTrusted',
      'follow',
      'unfollow',
      'fetchFollows',
      'fetchTrusteds'
    ]),
    ...mapActions('auth', [
      'updateUser'
    ]),
    ...mapActions('profileAssessments', [
      'hideContainer'
    ])
  },
  watch: {
    username: function() {
      this.hideContainer();
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
  top: 30px;
}
</style>
