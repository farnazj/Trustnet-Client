<template>
  <v-container class="pa-2" v-observe-visibility="!postSeen && {
    callback: visibilityChanged,
    throttle: 3000
  }">
    <v-row align="center" no-gutters>
      <!-- <v-col cols="1>
        <v-icon v-if="postSeen">far fa-eye</v-icon>
        <v-icon v-else>far fa-eye-slash</v-icon>
      </v-col> -->
      <v-col cols="11">

        <v-card @click="revealArticleDetails(post)" class="pa-1 "
        :tile="shownAssessmentPostId == null || shownAssessmentPostId != post.id"
        :elevation="shownAssessmentPostId == post.id ? 24 : 3">
          <v-row no-gutters >

            <!-- <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 3">
              <v-row no-gutters justify="center">
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 6 : 12" >
                  <v-img v-if="post.image" :src="post.image" contain class="rounded"> </v-img>
                </v-col>
              </v-row>

              <v-row class="mt-1" no-gutters>
                <v-col cols="12">
                  <initiator-display :userId="post.SourceId" :postDate="post.publishedDate">
                  </initiator-display>
                </v-col>
              </v-row>
            </v-col>
             -->

            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : (defaultView ? 3 : 2)">
              <v-row no-gutters>
                <v-col v-if="defaultView" :cols="$vuetify.breakpoint.smAndDown ? 6  : 12" class="py-1">
                  <v-img v-if="post.image" :src="post.image" contain class="rounded"> </v-img>
                </v-col>

                <v-col :cols="$vuetify.breakpoint.smAndDown ? 6 : 12" class="py-1">
                  <initiator-display :userId="post.SourceId" :postDate="post.publishedDate">
                  </initiator-display>
                </v-col>
                </v-row>
            </v-col>

            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : (defaultView ? 6: 7)">
              <v-row no-gutters>
                <v-col cols="12">
                   <div class="px-2">
                    
                     <span v-if="displayedAlternativeTitle" class="mx-1 font-italic font-weight-light interactable title title-custom "
                     >{{displayedAlternativeTitle}}</span>

                      <p :class="['mr-1', 'interactable', $vuetify.breakpoint.smAndDown ? 'title-custom-small': 'title-custom',
                      { 'original-title': displayedAlternativeTitle, 'title': $vuetify.breakpoint.smAndDown }]"
                     v-html="post.title"></p>

                       <v-tooltip bottom>
                         <template v-slot:activator="{ on }">
                           <v-btn v-on="on" @click.stop="showTitles" class='ml-0' small icon color="lime lighten-1">
                             <v-icon class="xs-icon-font">edit</v-icon>
                           </v-btn>
                         </template>
                         <span>alternative titles</span>
                       </v-tooltip>
                     <p v-if="!$vuetify.breakpoint.xsOnly && defaultView" :class="['mt-1', 'mb-0', 'grey--text', 'text--darken-3', 'body-2', {'caption': $vuetify.breakpoint.smAndDown}]" 
                     v-html="post.description"></p>
                   </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 3">
              <v-row justify="space-around" fill-height wrap no-gutters>

                <v-col cols="12" v-if="!$vuetify.breakpoint.smAndDown">
                  <v-row wrap v-for="(item, key, index) in sortedAssessments" :key="index" no-gutters>
                    <preview-assessments :assessmentType="key" :assessmentsInCategory="item">
                    </preview-assessments>
                  </v-row>
                </v-col>

                <v-col cols="12" v-else>
                  <span v-for="(item, key, index) in sortedAssessments" :key="index">
                    <preview-assessments :assessmentType="key" :assessmentsInCategory="item">
                    </preview-assessments>
                  </span>
                </v-col>
                
              </v-row>
            </v-col>

          </v-row>

          <v-row v-if="uniqueBoosters.length" no-gutters wrap>
            <v-col cols="12" >
              <v-icon small>fas fa-share</v-icon>
              <span @click.stop="showBoosters" class="caption blue--text text--darken-3 interactable">
                Show sharers info</span>

              <v-btn @click.stop="showEngagementPane('discussion')" class="comment-indicator pr-3"
                v-if="postHasComment" plain>
                <v-icon >fa-regular fa-comments</v-icon>
              </v-btn>

            </v-col>
          </v-row>

          <tags-container v-if="post.Tags" :tags="post.Tags"
          :filtersNamespace="filtersNamespace" :compact=true></tags-container>

        </v-card>
      </v-col>

      <v-col :offset="$vuetify.breakpoint.smAndDown ? 8 : 0" :cols="$vuetify.breakpoint.smAndDown ? 3 : 1">
        <!-- <v-card flat @click.stop="revealAssessments" :height="$vuetify.breakpoint.smAndDown ? '17px' : '80px'" color="lime lighten-3"
          :class="[$vuetify.breakpoint.smAndDown ? 'assessment-hinter-vertical' : 'assessment-hinter-horizontal', 'interactable']"
          :elevation="shownAssessmentPostId == post.id ? 24 : 4"
        > -->
        <v-card flat @click.stop="showEngagementPane('assessments')" :height="$vuetify.breakpoint.smAndDown ? '17px' : '80px'" color="lime lighten-3"
          :class="[$vuetify.breakpoint.smAndDown ? 'assessment-hinter-vertical' : 'assessment-hinter-horizontal', 'interactable']"
          :elevation="shownAssessmentPostId == post.id ? 24 : 4"
        >
          <v-row align="center" justify="center" no-gutters class="parent-height" >
            <v-icon small>{{icons.gavel}}</v-icon>
          </v-row>
        </v-card>
      </v-col>

    </v-row>

  </v-container>
</template>

<script>
  import initiatorDisplay from '@/components/InitiatorDisplay'
  import tagsContainer from '@/components/TagsContainer'
  import previewAssessments from '@/components/PreviewAssessments'
  import titleHelpers from '@/mixins/titleHelpers'
  import assessmentHelpers from '@/mixins/assessmentHelpers'
  import sourceServices from '@/services/sourceServices'
  import postServices from '@/services/postServices'
  import utils from '@/services/utils'
  import consts from '@/services/constants'
  import { mapState, mapActions } from 'vuex'
  import { mdiGavel } from '@mdi/js';

  const { INITIAL_TOP_LEVEL_COMMENTS_LIMIT } = consts;

  export default {
    components: {
     'initiator-display': initiatorDisplay,
     'tags-container': tagsContainer,
     'preview-assessments': previewAssessments
    },
    props: {
      filtersNamespace: {
        type: String,
        required: true
      },
      post: {
        type: Object
      }
    },
    data: () => {
      return {
        boostObjects: [],
        postSeen: false,
        displayedAlternativeTitle: null,
        initialTopLevelCommentsLimit: INITIAL_TOP_LEVEL_COMMENTS_LIMIT,
        icons: {
          gavel: mdiGavel
        }
      }
    },
     created() {
      this.fetchAssociations();
      this.fetchSeenStatus();
      this.arrangeTitles();

      // let thisRef = this;
    
      /*
      Checking to see if the post has at least one comment (top level comment or reply to an assessment)
      to signal it on the preview card
      */ 
      this.getPostComments({
        postIdOfComments: this.post.id,
        limit: 1,
        offset: 0
      })
      .then(postComment => {
        if (postComment.length)
          this.updateHasComments({ postId: this.post.id, hasComments: true });
        else {
          
          let assessmentSourceIds = Object.values(this.assessments).flat().map(assessment => assessment.lastVersion.SourceId).filter(sourceId => sourceId);
          assessmentSourceIds.forEach(sourceId => {
            this.getReplyComments({
              rootSetId: sourceId,
              limit: 1,
              offset: 0
            })
            .then(replies => {
              if (replies.length)
                this.updateHasComments({ postId: this.post.id, hasComments: true });
            })
          });
        }
      })
    },
    computed: {

      sortedBoosts: function() {
        return this.boostObjects.slice().sort(utils.compareBoosters);
      },
      uniqueBoosters: function() {
        return utils.getUnique(this.sortedBoosts, 'id');
      },

      shownAssessmentPostId: function() {
        return this.assessmentState.postIdOfAssessments;
      },
      ...mapState({
         assessmentState (state) {
           return state['assessments'];
         },
         commentState (state) {
           return state['comments'];
         },
      }),
      defaultView: function() {
        return typeof this.userPreferences.articlePreviewTheme === 'undefined' || this.userPreferences.articlePreviewTheme === 'default';
      },
      ...mapState('preferences', [
        'userPreferences'
      ]),
      postHasComment: function() {
        let getterName = this.filtersNamespace + '/postHasComment';
        return this.$store.getters[getterName](this.post.id);
      }

    },
    methods: {
      visibilityChanged: function(isVisible, entry) {

        if (isVisible) {
          if (!this.postSeen)
            postServices.changeSeenStatus({ postId: this.post.id },
            { seen_status: 'seen' });
          this.postSeen = true;
        }
      },
      revealArticleDetails: function(article) {
        this.showArticleDrawer(article);
      },
      revealAssessments: function() {
        this.showAssessments({
          assessments: this.assessments,
          postIdOfAssessments: this.post.id
        });
      },
      getInitialComments: function() {
        if (this.commentState.postIdOfComments !== this.post.id) {
          this.clearComments()
          .then(() => {
            return this.getPostComments({
              postIdOfComments: this.post.id,
              limit: this.initialTopLevelCommentsLimit,
              offset: 0
            })
          })
        }
        
      },
      fetchAssociations: function() {

        this.boostObjects = [];

        let boostProms = [];
        this.post.PostBoosts.forEach(postBoost => {
          boostProms.push(sourceServices.getSourceById(postBoost.SourceId)
          .then(response => {
            let boostObj = Object.assign({}, postBoost);
            boostObj.booster = response.data;
            this.boostObjects.push(boostObj);
          }))
        });
        this.boostObjects.sort(utils.compareBoosters);

        this.restructureAssessments();

        return Promise.all(boostProms);
      },
      fetchSeenStatus: function() {

        postServices.getSeenStatus({ postId: this.post.id })
        .then(res => {
          this.postSeen = res.data.seen;
        })
        .catch(err => {
          console.log(err);
        })
      },
      showBoosters: function() {

        this.populateBoosters(this.sortedBoosts);
        this.setBoostersVisibility(true);
      },
      arrangeTitles: function() {

        return new Promise((resolve, reject) => {

          this.setPostTitleIds({ postId: this.post.id, standaloneTitleIds: this.post.PostStandAloneTitles.length ? 
            this.post.PostStandAloneTitles.map(standaloneTitle => standaloneTitle.id) : [] });
          let customTitles = this.post.PostStandAloneTitles.length ? this.post.PostStandAloneTitles.map(standaloneTitle => 
            standaloneTitle.StandaloneCustomTitles) : [];

          let uniqueCustomTitlesSeen = [];
          let uniqueCustomTitles = [];

          let allCustomTitles = customTitles.flat();
          for (let customTitle of allCustomTitles) {
            if (!(customTitle.id in uniqueCustomTitlesSeen)) {
                uniqueCustomTitlesSeen.push(customTitle.id);
                uniqueCustomTitles.push(customTitle);
            } 
          }

          return this.arrangeCustomTitles(uniqueCustomTitles) //in titleHelpers mixin
          .then(res => {
            if (this.sortedTitles.length) {
              this.displayedAlternativeTitle = this.sortedTitles[0]['lastVersion'].text;
            }
            else {
              this.displayedAlternativeTitle = null;
            }

            resolve();
          })
        })
      },
      showTitles: function() {

        this.setPostTitleIds({ postId: this.post.id, standaloneTitleIds: this.post.PostStandAloneTitles.length ? 
            this.post.PostStandAloneTitles.map(standaloneTitle => standaloneTitle.id) : [] });
        this.populateTitles(this.titleObjects);
        this.setTitlesVisibility(true);
      },
      showEngagementPane: function(initialTab) {
        this.revealAssessments();
        this.getInitialComments();
        this.setInitialTab(initialTab);
        this.updateCommentsPostId(this.post.id);
      },
      ...mapActions({
        populateBoosters (dispatch, payload) {
          return dispatch('articleDetails' + '/populateBoosters', payload)
        },
        setBoostersVisibility (dispatch, payload) {
          return dispatch('articleDetails' + '/setBoostersVisibility', payload)
        },
        showArticleDrawer (dispatch, payload) {
          return dispatch('articleDetails' + '/showArticleDrawer', payload)
        },
        showAssessments (dispatch, payload) {
          return dispatch('assessments' + '/showAssessments', payload)
        },
        updateCommentsPostId (dispatch, payload) {
          return dispatch('comments' + '/updateCommentsPostId', payload)
        },
        getPostComments (dispatch, payload) {
          return dispatch('comments' + '/getPostComments', payload)
        },
        getReplyComments (dispatch, payload) {
          return dispatch('comments' + '/getReplyComments', payload)
        },
        clearComments (dispatch) {
          return dispatch('comments' + '/clearComments')
        },
        updateHasComments (dispatch, payload) {
          return dispatch(this.filtersNamespace + '/updateHasComments', payload)
        },
        setInitialTab (dispatch, payload) {
          return dispatch('assessments' + '/setInitialTab', payload)
        }

      })

    },
    watch: {
      post: function(val) {
        /*
        For when the user deletes their boost in BoostersList
        */
        this.fetchAssociations()
        .then(() => {
          this.populateBoosters(this.sortedBoosts);
        })

        this.arrangeTitles()
        .then( res => {
          if (this.customTitlesVisible) {
            this.populateTitles(this.sortedTitles);
          }
        })

      }
    },
    mixins: [titleHelpers, assessmentHelpers]

}
</script>

<style scoped>

.rounded {
  border-radius: 2%;
}

.assessment-hinter-horizontal {
  border-radius: 0 30% 30% 0;
  max-width: 22px;
}

.assessment-hinter-vertical {
  border-radius: 0 0 30% 30%;
  /* max-width: 35px; */
}

.title-custom {
  line-height: 1.5rem;
  font-size: 1.1rem !important;
  display: inline !important;
}

.title-custom-small {
  line-height: 1em;
  font-size: 1em !important;
  display: inline !important;
}

.alt-title {
  font-size: 1.1rem !important;
}
/* 
.assessment-handle {
  max-width: 22px;
} */

.original-title {
  text-decoration: line-through;
  font-size: 0.9rem !important;
}


.comment-indicator {
  float: right;
}
</style>
