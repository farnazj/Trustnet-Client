<template>
  <v-container>
    <v-layout row align-center>
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

                    <v-layout row wrap v-for="(item, key, index) in assessments" :key="index">
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
              <custom-avatar v-for="booster in boosters.slice(0,12)" :key="booster.id"
              :user="booster" :clickEnabled="true" class="mr-2">
              </custom-avatar>
              <span v-if="boosters.length > 2" @click.stop="showBoosters" class="headline cursor-pointer">
                ...</span>
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
        boosters: [],
        assessments: {'confirmed': [], 'refuted': [], 'questioned': []}
      }
    },
    methods: {
      revealArticleDetails: function(article) {
        this.showArticleDrawer(article);
      },
      revealAssessments: function() {
        this.showAssessments(this.assessments);
      },
      fetchAssociations: function() {
        let all_boosters = this.post.Boosteds.map(boost => boost.Boosters).flat();
        this.boosters = utils.getUnique(all_boosters, 'id');
        this.boosters.sort(utils.compareBoosters);

        for (let key in this.assessments)
          this.assessments[key] = [];
        /*
        Fetches the user objects of sourceIds in each PostAssessment and organizes
        assessments by validity status
        */
        let sorted_assessments = this.post.PostAssessments.sort(utils.compareAssessments);

        sorted_assessments.forEach(post_assessment => {
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
      showBoosters: function() {
        this.populateBoosters(this.boosters);
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
    },
    watch: {
      post: function(val) {
        this.fetchAssociations();
      }
    },

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
