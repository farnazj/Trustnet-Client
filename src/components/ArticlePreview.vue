<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>

        <v-card class="pa-1" flat>
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

                  <v-flex xs12 @click.stop="revealAssessments" >
                    <v-layout row v-for="(item, key, index) in assessments" :key="index" class="mb-1">
                      <v-flex xs12>
                        <v-icon class="mr-3" v-if="key == 'confirmed' && item.length">fas fa-check</v-icon>
                        <v-icon class="mr-4" v-else-if="key == 'refuted' && item.length">fas fa-times</v-icon>
                        <v-icon class="mr-4" v-else-if="key == 'questioned' && item.length">fas fa-question</v-icon>

                        <custom-avatar v-for="assessment in item.slice(0,3)" :key="assessment.id"
                        :user="assessment.assessor" class="mr-1"></custom-avatar>

                        <span v-if="item.length > 3">...</span>

                        </v-flex>
                    </v-layout>

                  </v-flex>

              </v-layout>

            </v-flex>

          </v-layout>

          <v-layout row class="pt-2" wrap>
            <v-flex xs12 >
              <v-icon >fas fa-rocket</v-icon> <span class="mr-3"> Boosted by</span>
              <custom-avatar v-for="booster in boosters.slice(0,15)" :key="booster.id"
              :user="booster" class="mr-1">
              </custom-avatar>
            </v-flex>
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
  import { mapActions } from 'vuex';

  const validityMapping = { '0': 'refuted', '1': 'questioned', '2': 'confirmed'};

  export default {
    components: {
     'custom-avatar': customAvatar,
     'initiator-display': initiatorDisplay
    },
    props: ['post'],
    data: () => {
      return {
        boosters: [],
        assessments: {'confirmed': [], 'refuted': [], 'questioned': []},
      }
    },
    methods: {
      revealAssessments: function() {
        this.showAssessments(this.assessments);
      },
      ...mapActions('assessments', [
        'showAssessments'
      ])
    },
    created() {

      this.boosters = [...new Set(this.post.Boosteds.map(boost => boost.Boosters).flat())];

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

    }

}
</script>

<style scoped>

.rounded {
  border-radius: 2%;
}
</style>
