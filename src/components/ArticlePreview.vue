<template>
  <v-container v-observe-visibility="!postSeen && {
    callback: visibilityChanged,
    throttle: 300
  }">
    <v-layout row align-center>
      <!-- <v-flex xs1>
        <v-icon v-if="postSeen">far fa-eye</v-icon>
        <v-icon v-else>far fa-eye-slash</v-icon>
      </v-flex> -->
      <v-flex xs12>

        <v-card @click="revealArticleDetails(post)" class="pa-1 pb-2" flat>
          <v-layout row>
            <v-flex xs4>
              <v-layout row>
                <v-flex xs12>
                  <v-img v-if="post.image" :src="post.image" contain class="rounded"> </v-img>
                </v-flex>
              </v-layout>

              <v-layout row class="py-2" >
                <initiator-display :userId="post.SourceId" :postDate="post.updatedAt">
                </initiator-display>
              </v-layout>

            </v-flex>

            <v-flex xs5>
              <v-layout row>
                <v-flex xs12>
                  <v-card-title primary-title class="pt-0">
                   <div>
                     <h3 class="mb-2">{{post.title}}</h3>
                     <p class="grey--text text--darken-3">{{post.description}}</p>
                   </div>
                </v-card-title>

                </v-flex>
              </v-layout>

            </v-flex>

            <v-flex xs3>
              <v-layout col justify-space-around fill-height wrap>

                  <v-flex xs12 >

                    <v-layout row wrap v-for="(item, key, index) in sortedAssessments" :key="index">
                      <v-flex xs12 :class="item.length ? 'mb-2' : 'mb-0' " >
                        <v-layout align-center>
                          <v-icon class="mr-3" v-if="key == 'confirmed' && item.length">fas fa-check</v-icon>
                          <v-icon class="mr-4" v-else-if="key == 'refuted' && item.length">fas fa-times</v-icon>
                          <v-icon class="mr-4" v-else-if="key == 'questioned' && item.length">fas fa-question</v-icon>

                          <custom-avatar v-for="assessment in item.slice(0,3)" :key="assessment.id"
                          :user="assessment.assessor" :clickEnabled="true" class="mr-2"></custom-avatar>

                          <span v-if="item.length > 3" class="headline">...</span>
                        </v-layout>
                        </v-flex>
                    </v-layout>

                  </v-flex>

              </v-layout>

            </v-flex>

          </v-layout>

          <v-layout row class="pt-2" wrap>
            <v-flex xs12 >
              <v-icon >fas fa-rocket</v-icon> <span class="mr-3"> Boosted by</span>
              <custom-avatar v-for="boostObj in uniqueBoosters.slice(0,10)" :key="boostObj.id"
              :user="boostObj.booster" :clickEnabled="true" class="mr-2">
              </custom-avatar>
              <span @click.stop="showBoosters" class="caption blue--text text--darken-3 cursor-pointer">
                Show info</span>
            </v-flex>
          </v-layout>

        </v-card>

      </v-flex>

      <v-flex>
        <v-card flat @click.stop="revealAssessments" height="80px" color="lime lighten-3"
          class="assessment-hinter cursor-pointer">
          <v-layout row fill-height align-center>
            <v-icon medium>arrow_right</v-icon>
          </v-layout>
        </v-card>
      </v-flex>

    </v-layout>


  </v-container>
</template>

<script>
  import customAvatar from '@/components/CustomAvatar'
  import initiatorDisplay from '@/components/InitiatorDisplay'
  import sourceServices from '@/services/sourceServices'
  import postServices from '@/services/postServices'
  import utils from '@/services/utils'
  import { mapActions } from 'vuex'

  const validityMapping = { '0': 'refuted', '1': 'questioned', '2': 'confirmed'};

  export default {
    components: {
     'custom-avatar': customAvatar,
     'initiator-display': initiatorDisplay
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
        for (const [key, value] of Object.entries(this.assessments))
          this.assessments[key].slice().sort(utils.compareAssessments)

        return this.assessments;
      }
    },
    methods: {
      visibilityChanged: function(isVisible, entry) {
        if (isVisible) {
          if (!this.postSeen)
            postServices.changeSeenStatus({postId: this.post.id},
            {seen_status: 'seen'});
          this.postSeen = true;
        }
      },
      revealArticleDetails: function(article) {
        this.showArticleDrawer(article);
      },
      revealAssessments: function() {
        this.showAssessments(this.assessments);
      },
      fetchAssociations: function() {

        this.post.Boosteds.forEach(boosted => {
          sourceServices.getSourceById(boosted.SourceId)
          .then(response => {
            let boost_obj = Object.assign({}, boosted);
            boost_obj.booster = response.data;
            this.boostObjects.push(boost_obj);
          })
        })
        this.boostObjects.sort(utils.compareBoosters);

        for (let key in this.assessments)
          this.assessments[key] = [];
        /*
        Fetches the user objects of sourceIds in each PostAssessment and organizes
        assessments by validity status
        */
        this.post.PostAssessments.forEach(post_assessment => {
          let assessment_obj = {};
          for (const [key, value] of Object.entries(post_assessment)) {
            assessment_obj[key] = value;
          }

          sourceServices.getSourceById(post_assessment.SourceId)
          .then(response => {
            assessment_obj['assessor'] = response.data;

            let cred_value = validityMapping[post_assessment.postCredibility.toString()];
            this.assessments[cred_value].push(assessment_obj);
          })
        })

      },
      fetchSeenStatus: function() {
        postServices.getSeenStatus({postId: this.post.id})
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
      ...mapActions({
        showAssessments (dispatch, payload) {
          return dispatch(this.assessmentsNamespace + '/showAssessments', payload)
        }
      }),
      ...mapActions({
        populateBoosters (dispatch, payload) {
          return dispatch(this.detailsNamespace + '/populateBoosters', payload)
        },
        setBoostersVisibility (dispatch, payload) {
          return dispatch(this.detailsNamespace + '/setBoostersVisibility', payload)
        },
        showArticleDrawer (dispatch, payload) {
          return dispatch(this.detailsNamespace + '/showArticleDrawer', payload)
        }
      })

    },
    created() {
      this.fetchAssociations();
      this.fetchSeenStatus();
    },
    watch: {
      post: function() {
        this.fetchAssociations();
      }
    }

}
</script>

<style scoped>

.rounded {
  border-radius: 2%;
}

.assessment-hinter {
  border-radius: 0 30% 30% 0;

}

</style>
