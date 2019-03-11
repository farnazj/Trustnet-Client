<template>
  <v-layout wrap>
    <v-navigation-drawer v-model="articleDetailsVisible"
      temporary right width="950" fixed disable-route-watcher>

     <v-card class="full-height">

       <v-layout row class="pa-2" justify-end>
         <v-flex xs4 class="right-align">

           <v-menu v-model="assessmentMenu"
             :close-on-content-click="false"
             :nudge-width="350" offset-y left attach>

              <v-btn flat icon color="blue darken-1" slot="activator"
               class="mr-4">
                <v-icon >gavel</v-icon>
              </v-btn>

             <v-form ref="assessmentMenu" lazy-validation>
               <v-card>
                 <v-container fluid>

                   <assessment-collector ref="assessmentColl" :validityRules="assessmentValidityRules"
                     :postCredibility="postCredibility" :assessmentBody="assessmentBody">
                   </assessment-collector>
                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn flat @click="cancel('assessmentMenu')">Cancel</v-btn>
                  <v-btn color="primary" flat @click="postAssessment">
                    <v-icon class="pr-1" >gavel</v-icon> Assess
                  </v-btn>
                </v-card-actions>

              </v-card>
            </v-form>

            <v-alert v-model="assessmentAlert" type="error" dismissible>
              Something went wrong. Try again later.
            </v-alert>

         </v-menu>

         <v-menu v-model="boostMenu"
           :close-on-content-click="false"
           :nudge-width="350" offset-y left attach>

           <v-btn flat icon color="blue darken-1" class="mr-4" slot="activator"
           :disabled="disableBoost">
             <v-icon >fas fa-rocket</v-icon>
           </v-btn>

           <v-form ref="boostMenu" lazy-validation>
             <v-card>
               <v-container fluid>

                 <v-layout row>
                   <v-flex xs12>
                     <span>Select your target audience or leave this empty to
                       include everyone</span>
                     <source-selector ref="boostTargets" class="mt-2">
                     </source-selector>
                   </v-flex>
                 </v-layout>

                 <v-card-actions>
                   <v-spacer></v-spacer>

                   <v-btn flat @click="cancel('boostMenu')">Cancel</v-btn>
                   <v-btn color="primary" flat @click="boostArticle">
                     <v-icon class="pr-1" >fas fa-rocket</v-icon> Boost
                   </v-btn>
                 </v-card-actions>
               </v-container>

               </v-card>
             </v-form>

             <v-alert v-model="boostAlert" type="error" dismissible>
               Something went wrong. Try again later.
             </v-alert>

          </v-menu>


         </v-flex>
       </v-layout>
       <v-divider></v-divider>

       <v-layout row>
         <v-container>


           <v-layout row justify-center class="centered">
             <v-flex xs8>

               <v-card-title primary-title class="mb-2">
                  <v-layout row justify-center>
                    <div class="headline">{{article.title}}</div>
                  </v-layout>

                </v-card-title>

                <initiator-display :userId="article.SourceId"
                :postDate="article.updatedAt" class="mb-2">
                </initiator-display>

               <v-img v-if="article.image" :src="article.image" contain class="rounded">
               </v-img>
             </v-flex>
           </v-layout>

           <v-layout row class="my-2">
             <v-flex xs12>
               <v-card-text class="body-text">
                 <p v-if="article.body">
                   {{article.body}}
                 </p>
                 <p v-else-if="article.description">
                   {{article.description}}
                 </p>

               </v-card-text>

             </v-flex>
           </v-layout>

           <v-layout row justify-center class="mt-2">
             <v-flex xs6>
               <v-card-actions v-if="article.url">
                 <v-btn outline block color="blue darken-1"
                  :href="article.url" target="_blank">
                   Visit Website</v-btn>

               </v-card-actions>
             </v-flex>
           </v-layout>

         </v-container>


       </v-layout>
     </v-card>

   </v-navigation-drawer>
  </v-layout>

</template>

<script>
import initiatorDisplay from '@/components/InitiatorDisplay'
import assessmentCollector from '@/components/AssessmentCollector'
import sourceSelector from '@/components/SourceSelector'

import sourceServices from '@/services/sourceServices'
import assessmentServices from '@/services/assessmentServices'
import postServices from '@/services/postServices'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
   'initiator-display': initiatorDisplay,
   'assessment-collector': assessmentCollector,
   'source-selector': sourceSelector
  },
  data: () => {
    return {
      disableBoost: false,
      assessmentMenu: false,
      boostMenu: false,
      postCredibility: null,
      assessmentBody: '',
      assessmentValidityRules: [
        v => !!v || 'Assess the accuracy of the article'
      ],
      assessmentAlert: false,
      boostAlert: false
    }
  },
  created() {

  },
  computed: {

    articleDetailsVisible: {
      get: function() {
          return this.drawerVisible;
      },
      set: function(newValue) {
        this.setDrawerVisibility(newValue);
      }
    },
    ...mapState('articleDetails', [
     'drawerVisible',
     'article',
     'assessment'
   ])

  },
  watch: {
    article: function(val) {

      this.getAuthUserPostAssessment()
      .then(() => {
        if (Object.entries(this.assessment).length != 0) {
            this.disableBoost = false;
            this.assessmentBody = this.assessment.body;
            this.postCredibility = parseInt(this.assessment.postCredibility) + 1;
          }
          else {
            this.disableBoost = true;
            this.assessmentBody = '';
            this.postCredibility = null;
            this.$refs.assessmentMenu.resetValidation();
          }
      })
    }

  },
  methods: {
    postAssessment: function() {
      if (this.$refs.assessmentMenu.validate()) {
        let reqBody = {
          postCredibility: this.$refs.assessmentColl.credibility - 1,
          body: this.$refs.assessmentColl.assessmentText
        }

        this.postAuthUserAssessment(reqBody)
        .then(() => {
          this.assessmentMenu = false;
          this.disableBoost = false;
          this.updateStateArticle({postId: this.article.id});
        })
        .catch(err => {
          this.assessmentAlert = true;
        })

      }
    },
    boostArticle: function() {
      if (this.$refs.boostMenu.validate()) {
        let reqBody = {
          post_id: this.article.id,
          target_usernames: this.$refs.boostTargets.targets
        }

        postServices.boostArticle(reqBody)
        .then(response => {
          if (response.status != 200)
            this.boostAlert = true;
          else {
            this.boostMenu = false;
            this.updateStateArticle({postId: this.article.id})
          }

        })
      }
    },
    cancel: function(menu) {
      this.$refs[menu].resetValidation();
      this[menu] = false;
    },
    ...mapActions('articleDetails', [
      'setDrawerVisibility',
      'getAuthUserPostAssessment',
      'postAuthUserAssessment'
    ]),
    ...mapActions('articleFilters', [
      'updateStateArticle'
    ])
  }
}
</script>

<style scoped>
.right-align {
  text-align: right;
}

.centered {
  text-align: center;
}

.rounded {
  border-radius: 1%;
}

.body-text {
  font-size: 1.1em;
}

.full-height {
  min-height: 100%;

}

</style>
