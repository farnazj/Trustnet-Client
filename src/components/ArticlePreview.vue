<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>

        <v-card class="pa-1">
          <v-layout row>
            <v-flex xs4>
              <v-layout col fill-height>
                <v-flex xs12>
                  <v-img v-if="post.image" v-bind:src="post.image" contain class="rounded"> </v-img>

                </v-flex>
              </v-layout>

            </v-flex>

            <v-flex xs5>
              <v-layout row>
                <v-flex xs12>
                  <v-card-title primary-title class="pt-0">
                   <div>
                     <h3 class="mb-2">{{post.title}}</h3>
                     <p>{{post.description}}</p>
                   </div>
                </v-card-title>

                </v-flex>
              </v-layout>

            </v-flex>

            <v-flex xs3>
              <v-layout col justify-space-around fill-height wrap>

                    <v-flex xs12 v-for="(item, key) in assessments" >
                        <v-icon class="mr-3" v-if="key == 'confirmed'">fas fa-check</v-icon>
                        <v-icon class="mr-3" v-else-if="key == 'refuted'">fas fa-times</v-icon>
                        <v-icon class="mr-3" v-else>fas fa-question</v-icon>

                        <custom-avatar v-for="assessment in item.slice(0,3)" v-bind:key="assessment.id"
                        v-bind:user="assessment.assessor"></custom-avatar>

                    </v-flex>

              </v-layout>

            </v-flex>

          </v-layout>

          <v-layout row class="pt-2">
            <v-flex xs12 >
              <v-icon >fas fa-rocket</v-icon> <span class="mr-3"> Boosted by</span>
              <custom-avatar v-for="booster in boosters" v-bind:key="booster.id" v-bind:user="booster">
              </custom-avatar>
            </v-flex>
          </v-layout>

          </v-card>

      </v-flex>

    </v-layout>


  </v-container>
</template>

<script>
  import customAvatar from '../components/CustomAvatar'

  const validityMapping = { '0': 'refuted', '1': 'questioned', '2': 'confirmed'};

  export default {
    components: {
     'custom-avatar': customAvatar
    },
    props: ['post', 'boosters'],
    data: () => {
      return {
        assessments: {'confirmed': [], 'refuted': [], 'questioned': []}
      }
    },
    created() {

      /*
      Fetches the user objects of sourceIds in each PostAssessment and organizes
      assessments by validity status
      */
      this.post.PostAssessments.forEach(post_assessment => {
        let assessment_obj = {};
        for (const [key, value] of Object.entries(post_assessment)) {
          assessment_obj[key] = value;
        }
        this.$http.get('http://localhost:3000/sources/ids/' + post_assessment.SourceId,
          {credentials: true}
        ).then(response => {
          assessment_obj['assessor'] = response.body;

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
