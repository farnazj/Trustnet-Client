<template>
  <v-container v-observe-visibility="!postSeen && {
    callback: visibilityChanged,
    throttle: 300
  }">
    <v-row align="center" no-gutters>
      <!-- <v-col cols="1>
        <v-icon v-if="postSeen">far fa-eye</v-icon>
        <v-icon v-else>far fa-eye-slash</v-icon>
      </v-col> -->
      <v-col cols="11">

        <v-card @click="revealArticleDetails(post)" class="pa-1 pb-2" :flat="shownAssessmentPostId != post.id">
          <v-row no-gutters >

            <v-col cols="3">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-img v-if="post.image" :src="post.image" contain class="rounded"> </v-img>
                </v-col>
              </v-row>

              <v-row class="py-2" no-gutters>
                <v-col cols="12">
                  <initiator-display :userId="post.SourceId" :postDate="post.updatedAt">
                  </initiator-display>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="5">
              <v-row no-gutters>
                <v-col cols="12">
                   <div class="px-2">
                     <p class="mr-1 cursor-pointer title title-custom">{{post.title}}</p>
                       <v-tooltip bottom>
                         <template v-slot:activator="{ on }">
                           <v-btn v-on="on" @click.stop="showTitles" class="ml-1" small icon color="lime lighten-1">
                             <v-icon class="xs-icon-font">fas fa-info</v-icon>
                           </v-btn>
                         </template>
                         <span>alternative titles</span>
                       </v-tooltip>
                     <p class="mt-2 grey--text text--darken-3 body-2">{{post.description}}</p>
                   </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="4">
              <v-row justify="space-around" fill-height wrap no-gutters>

                <v-col cols="12" >
                  <v-row wrap v-for="(item, key, index) in sortedAssessments" :key="index" no-gutters>
                    <v-col cols="12" :class="item.length ? 'mb-2' : 'mb-0' " >
                      <v-row align="center" wrap no-gutters>
                        <v-icon class="mr-3" v-if="key == 'confirmed' && item.length">fas fa-check</v-icon>
                        <v-icon class="mr-4" v-else-if="key == 'refuted' && item.length">fas fa-times</v-icon>
                        <v-icon class="mr-4" v-else-if="key == 'questioned' && item.length">fas fa-question</v-icon>

                        <assessor v-for="assessment in item.slice(0,3)" :key="assessment.lastVersion.id"
                          :user="assessment.assessor" :isTransitive="assessment.lastVersion.isTransitive"
                          :credibilityValue="assessment.lastVersion.postCredibility" class="mr-2 mb-2">
                        </assessor>

                        <span v-if="item.length > 3" >...</span>

                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>

              </v-row>
            </v-col>

          </v-row>

          <v-row v-if="uniqueBoosters.length" class="pt-1" no-gutters wrap>
            <v-col cols="12" >
               <v-icon >fas fa-share</v-icon>
              <!--<span class="mr-3"> Shared by</span>

               <custom-avatar v-for="boostObj in uniqueBoosters.slice(0,10)" :key="boostObj.id"
               :user="boostObj.booster" :clickEnabled="true" class="mr-2">
               </custom-avatar> -->

              <span @click.stop="showBoosters" class="caption blue--text text--darken-3 cursor-pointer">
                Show sharers info</span>
            </v-col>
          </v-row>

        </v-card>
      </v-col>

      <v-col>
        <v-card flat @click.stop="revealAssessments" height="80px" color="lime lighten-3"
          class="assessment-hinter cursor-pointer">
          <v-row align="center" no-gutters class="parent-height" >

            <v-icon medium>arrow_right</v-icon>
          </v-row>
        </v-card>
      </v-col>

    </v-row>

  </v-container>
</template>

<script>
  import assessor from '@/components/Assessor'
  import initiatorDisplay from '@/components/InitiatorDisplay'
  import titleHelpers from '@/mixins/titleHelpers'
  import sourceServices from '@/services/sourceServices'
  import postServices from '@/services/postServices'
  import consts from '@/services/constants'
  import utils from '@/services/utils'
  import { mapState, mapActions } from 'vuex'

  export default {
    components: {
     'initiator-display': initiatorDisplay,
     'assessor': assessor
    },
    props: {
      detailsNamespace: {
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
        assessments: {'confirmed': [], 'refuted': [], 'questioned': []},
        postSeen: false
      }
    },
    computed: {
      sortedBoosts: function() {
        return this.boostObjects.slice().sort(utils.compareBoosters);
      },
      uniqueBoosters: function() {
        return utils.getUnique(this.sortedBoosts, 'id');
      },
      sortedAssessments: function() {

        let sortedAssessments = {};

        for (const [key, value] of Object.entries(this.assessments)) {
          sortedAssessments[key] = this.assessments[key].slice().sort(utils.compareAssessments);
        }
        return sortedAssessments;
      },
      shownAssessmentPostId: function() {
        return this.assessmsentState.postIdOfAssessments;
      },
      ...mapState({
         assessmsentState (state) {
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
      validityMapping: function(credibility) {

        if (credibility < consts.VALIDITY_CODES.QUESTIONED)
          return 'refuted';
        else if (credibility == consts.VALIDITY_CODES.QUESTIONED)
          return 'questioned';
        else if (credibility > consts.VALIDITY_CODES.QUESTIONED)
          return 'confirmed';
      },
      fetchAssociations: function() {

        this.boostObjects = [];
        this.post.PostBoosts.forEach(postBoost => {
          sourceServices.getSourceById(postBoost.SourceId)
          .then(response => {
            let boostObj = Object.assign({}, postBoost);
            boostObj.booster = response.data;
            this.boostObjects.push(boostObj);
          })
        });
        this.boostObjects.sort(utils.compareBoosters);


        for (let key in this.assessments)
          this.assessments[key] = [];

        let assessmentsBySource = {};
        this.post.PostAssessments.forEach(postAssessment => {

          if (!(postAssessment.SourceId in assessmentsBySource)) {
            let assessmentsObj = {};
            assessmentsObj['history'] = [];
            assessmentsBySource[postAssessment.SourceId] = assessmentsObj;
          }

          if (postAssessment.version == 1) {
            assessmentsBySource[postAssessment.SourceId]['lastVersion'] = postAssessment;
          }
          else {
            assessmentsBySource[postAssessment.SourceId]['history'].push(postAssessment);
          }
       })

       for (const [SourceId, assessmentsObj] of Object.entries(assessmentsBySource)) {
          let credValue = this.validityMapping(assessmentsObj.lastVersion.postCredibility);
          sourceServices.getSourceById(SourceId)
          .then(response => {
            assessmentsBySource[SourceId]['assessor'] = response.data;
            this.assessments[credValue].push(assessmentsObj);
          })
       }

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
      showTitles: function() {
        this.setPostId(this.post.id);
        this.fetchCustomTitles() //in titleHelpers mixin
        .then(res => {
          this.populateTitles(this.titleObjects);
          this.setTitlesVisibility(true);
        })
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
    },
    watch: {
      post: function(val) {
        this.fetchAssociations();
      }
    },
    mixins: [titleHelpers]

}
</script>

<style scoped>

.rounded {
  border-radius: 2%;
}

.assessment-hinter {
  border-radius: 0 30% 30% 0;
  max-width: 22px;
}

.title-custom {
  line-height: 1.5rem;
  font-size: 1.1rem !important;
  display: inline !important;
}

.assessment-handle {
  max-width: 22px;
}


</style>
