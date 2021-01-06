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
        :elevation="shownAssessmentPostId == post.id ? 24 : 4">
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

            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 3">
              <v-row>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 6  : 12" class="py-2">
                  <v-img v-if="post.image" :src="post.image" contain class="rounded"> </v-img>
                </v-col>

                <v-col :cols="$vuetify.breakpoint.smAndDown ? 6 : 12">
                  <initiator-display :userId="post.SourceId" :postDate="post.publishedDate">
                  </initiator-display>
                </v-col>
                </v-row>
            </v-col>

            <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 6">
              <v-row no-gutters>
                <v-col cols="12">
                   <div class="px-2">
                     <p :class="['mr-1', 'cursor-pointer', $vuetify.breakpoint.smAndDown ? 'title-custom-small': 'title-custom',
                      { strikethrough: displayedAlternativeTitle, 'title': $vuetify.breakpoint.smAndDown }]"
                     v-html="post.title"></p>
                     <span v-if="displayedAlternativeTitle" class="mx-1 font-italic font-weight-light cursor-pointer title title-custom"
                     >{{displayedAlternativeTitle}}</span>

                       <v-tooltip bottom>
                         <template v-slot:activator="{ on }">
                           <v-btn v-on="on" @click.stop="showTitles" :class="$vuetify.breakpoint.smAndDown ? 'ml-0' : 'ml-1'" small icon color="lime lighten-1">
                             <v-icon class="xs-icon-font">fas fa-info</v-icon>
                           </v-btn>
                         </template>
                         <span>alternative titles</span>
                       </v-tooltip>
                     <p v-if="!$vuetify.breakpoint.xsOnly" :class="['mt-1', 'mb-0', 'grey--text', 'text--darken-3', 'body-2', {'caption': $vuetify.breakpoint.smAndDown}]" 
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
              <span @click.stop="showBoosters" class="caption blue--text text--darken-3 cursor-pointer">
                Show sharers info</span>
            </v-col>
          </v-row>

          <tags-container v-if="post.Tags" :tags="post.Tags"
          :filtersNamespace="filtersNamespace" :compact=true></tags-container>

        </v-card>
      </v-col>

      <v-col :offset="$vuetify.breakpoint.smAndDown ? 8 : 0" :cols="$vuetify.breakpoint.smAndDown ? 3 : 1">
        <v-card flat @click.stop="revealAssessments" :height="$vuetify.breakpoint.smAndDown ? '17px' : '80px'" color="lime lighten-3"
          :class="[$vuetify.breakpoint.smAndDown ? 'assessment-hinter-vertical' : 'assessment-hinter-horizontal', 'cursor-pointer']"
          :elevation="shownAssessmentPostId == post.id ? 24 : 4"
          >
          <v-row align="center" justify="center" no-gutters class="parent-height" >
            <v-icon :small="$vuetify.breakpoint.smAndDown" medium>arrow_right</v-icon>
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
  import { mapState, mapActions } from 'vuex'

  export default {
    components: {
     'initiator-display': initiatorDisplay,
     'tags-container': tagsContainer,
     'preview-assessments': previewAssessments
    },
    props: {
      detailsNamespace: {
        type: String,
        required: true
      },
      filtersNamespace: {
        type: String,
        required: true
      },
      assessmentsNamespace: {
        type: String,
        required: true
      },
      titlesNamespace: {
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
        displayedAlternativeTitle: null
      }
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
           return state[this.assessmentsNamespace];
         }
      })

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

        this.setPostId(this.post.id);

        return this.arrangeCustomTitles(this.post.PostCustomTitles) //in titleHelpers mixin
        .then(res => {
          if (this.sortedTitles.length) {
            this.displayedAlternativeTitle = this.sortedTitles[0]['lastVersion'].text;
          }
        })
      },
      showTitles: function() {

        this.setPostId(this.post.id);
        this.populateTitles(this.titleObjects);
        this.setTitlesVisibility(true);
      },
      ...mapActions({
        populateBoosters (dispatch, payload) {
          return dispatch(this.detailsNamespace + '/populateBoosters', payload)
        },
        setBoostersVisibility (dispatch, payload) {
          return dispatch(this.detailsNamespace + '/setBoostersVisibility', payload)
        },
        showArticleDrawer (dispatch, payload) {
          return dispatch(this.detailsNamespace + '/showArticleDrawer', payload)
        },
        showAssessments (dispatch, payload) {
          return dispatch(this.assessmentsNamespace + '/showAssessments', payload)
        }
      })

    },
    created() {
      this.fetchAssociations();
      this.fetchSeenStatus();
      this.arrangeTitles();
    },
    watch: {
      post: function(val) {

        /*
        For when the user deletes theri boost in BoostersList
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
/* 
.assessment-handle {
  max-width: 22px;
} */

.strikethrough {
  text-decoration: line-through
}

</style>
