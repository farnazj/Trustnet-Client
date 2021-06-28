<template>
  <v-container fluid class="px-0 flex-parent">

    <photo-upload field="avatar" v-model="showUploader"
        @crop-upload-success="updateAuthUser()"
        :noSquare="true"
        :width="400" :height="400"
        :url="uploadUrl"
        :withCredentials="true"
    langType="en">
    </photo-upload>

    <custom-toolbar></custom-toolbar>

    <article-details detailsNamespace="profileArticleDetails"
     filtersNamespace="profileArticles"> </article-details>

     <v-row no-gutters class="pt-9 flex-fixed-height-child">
      <v-card width="100%" color="secondary" class="profile-background">
        <v-container fluid>

          <v-row align="end" no-gutters >

            <v-col sm="2" cols="4">
              <v-row no-gutters justify="center">
                <v-hover v-if="Object.keys(profileOwner).length">
                  <v-img :src="profileOwner.photoUrl ? profileOwner.photoUrl : adorablePhoto"
                  class="profile-img" slot-scope="{ hover }" aspect-ratio="1" width="10" contain>
                    <v-expand-transition>
                      <div v-if="hover && profileOwner.userName == user.userName"
                        class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal white--text">
                        <v-btn @click="showUploader = true" small text rounded dark>
                          <v-icon class ="pl-0 ml-0" right dark>photo_camera</v-icon>
                        </v-btn>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-hover>
              </v-row>
            </v-col>

            <v-col sm="7" cols="5">
              <v-card-title>
                <div>
                  <div class="headline grey--text text--lighten-4" v-if="!profileOwner.systemMade || !profileOwner.isVerified">
                    {{sourceDisplayName(profileOwner)}}</div>
                   <div class="headline grey--text text--lighten-4" v-else>{{profileOwner.userName}}</div>

                  <div class="subheading grey--text text--lighten-2" v-if="!profileOwner.systemMade">({{profileOwner.userName}})</div>
                  <div class="caption grey--text text--lighten-2 mt-2" v-if="profileOwner.systemMade && !profileOwner.SourceFeeds.length && profileOwner.isVerified">
                    There is currently no RSS feed associated with this source. The posts on this page have been individually imported.
                    You can add this source's feed to {{siteName}} by going to the Sources page <v-icon small color="grey grey--lighten-2">arrow_right_alt</v-icon> Add Feeds.
                  </div>
                </div>
              </v-card-title>
            </v-col>

            <v-col cols="3">
              <v-row v-if="notUser" justify="end" wrap no-gutters>
                <v-btn :small="$vuetify.breakpoint.xsOnly" depressed @click="changeTrustStatus()"
                :color="isTrusted ? 'grey lighten-1' : 'light-green lighten-1' " class="ma-1">
                  <span v-if="!isTrusted">Trust</span>
                  <span v-else>Untrust</span>
                </v-btn>

                <v-btn :small="$vuetify.breakpoint.xsOnly" depressed @click="changeFollowStatus()"
                :color="isFollowed ? 'grey lighten-1' : 'blue lighten-1' " class="ma-1">
                  <span v-if="!isFollowed">Follow</span>
                  <span v-else>Unfollow</span>
                </v-btn>
              </v-row>
            </v-col>

          </v-row>

        </v-container>
      </v-card>
    </v-row>

    <v-row no-gutters class="flex-child">

      <v-col cols="12">
        <v-tabs centered background-color="blue darken-3" height=36 v-model="tabs"
          slider-color="amber lighten-1" dark class="profile-tabs">
          <v-tab href="#history">
            <v-icon class="mr-1">history</v-icon>
            Activity History
          </v-tab>

          <v-tab href="#followers">
            <v-icon class="mr-1">people</v-icon>
            Followers
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabs" class="parent-height">
          <v-tab-item value="history">
            <v-container fluid class="px-0">
              <v-row no-gutters>
                <boosters-list detailsNamespace="profileArticleDetails" filtersNamespace="profileArticles"></boosters-list>
                <custom-titles titlesNamespace="profileTitles" filtersNamespace="profileArticles"></custom-titles>
                <assessment-history namespace="profileAssessments"></assessment-history>

                <v-col cols="7" class="ml-2">
                  <article-holder detailsNamespace="profileArticleDetails" filtersNamespace="profileArticles"
                  assessmentsNamespace="profileAssessments" commentsNamespace="profileComments" titlesNamespace="profileTitles" :loadLocked="tabs != 'history'"></article-holder>
                </v-col>

                <assessments-container namespace="profileAssessments" class="assessments-container">
                </assessments-container>

              </v-row>
            </v-container>
          </v-tab-item>

          <v-tab-item value="followers">
            <followers-container :username="username"></followers-container>
          </v-tab-item>

        </v-tabs-items>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'
import articleHolder from '@/components/ArticleHolder'
import articleDetails from '@/components/ArticleDetails'
import assessmentsContainer from '@/components/AssessmentsContainer'
import followersContainer from '@/components/FollowersContainer'
import boostersList from '@/components/BoostersList'
import customTitles from '@/components/CustomTitles'
import assessmentHistory from '@/components/AssessmentHistory'
import photoUpload from 'vue-image-crop-upload'

import sourceServices from '@/services/sourceServices'
import sourceHelpers from '@/mixins/sourceHelpers'
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
    'custom-titles': customTitles,
    'assessment-history': assessmentHistory,
    'followers-container': followersContainer,
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
    if (!Object.keys(this.userPreferences).length)
      this.getUserPreferences();
  },
  computed: {
    uploadUrl: function() {
      return consts.BASE_URL + '/profile-pictures/';
    },
    adorablePhoto: function() {
      //return 'https://api.adorable.io/avatars/249/' + this.profileOwner.userName + '.png';
      return `https://avatars.dicebear.com/api/gridy/${utils.hashCode(this.profileOwner.userName)}.svg?mood[]=happy`;
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
    siteName: function() {
      return consts.SITE_NAME;
    },
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapGetters('relatedSources', [
      'trustedIds',
      'followedIds'
    ]),
    ...mapState('preferences', [
      'userPreferences'
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
            if (!this.profileOwner.photoUrl.includes('http'))
              this.profileOwner.photoUrl = consts.BASE_URL + '/' + this.profileOwner.photoUrl;
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
        this.addTrusted({ username: source.userName });
      }
      else
        this.deleteTrusted({ username: source.userName });
    },
    changeFollowStatus() {
      let source = this.profileOwner;
      if (!this.followedIds.includes(source.id))
        this.follow({ username: source.userName });
      else
        this.unfollow({ username: source.userName });
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
    ]),
    ...mapActions('preferences', [
      'getUserPreferences'
    ])
  },
  watch: {
    username: function(val) {
      this.hideContainer();
      this.setUsername(val);
      this.getUser();
    }
  },
  mixins: [sourceHelpers]

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

.flex-child {
  flex-grow: 2;
  flex-basis: auto;
}

.profile-background {
  border-radius: 0px !important;
}

.profile-tabs~.v-window {
  overflow: initial;
}

</style>
