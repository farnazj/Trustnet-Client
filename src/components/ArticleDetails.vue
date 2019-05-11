<template>
  <v-layout wrap>
    <v-navigation-drawer v-model="articleDetailsVisible"
      temporary right width="1000" fixed disable-route-watcher>

     <v-card class="full-height">

       <v-layout row class="pa-2" full-height align-center>

         <v-flex>
           <v-icon large @click="articleDetailsVisible = false">clear</v-icon>
         </v-flex>

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
                     :postCredibility="postCredibility" :assessmentBody="assessmentBody" :assessmentId="assessment.id">
                   </assessment-collector>
                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn flat @click="cancelMenu('assessmentMenu')">Cancel</v-btn>
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
           :close-on-content-click="false" :disabled="disableBoost"
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
                     <!-- <span>Select your target audience or leave this empty to
                       include everyone</span> -->
                     <source-selector ref="boostTargets" class="mt-2">
                     </source-selector>
                   </v-flex>
                 </v-layout>
               </v-container>

                 <v-card-actions>
                   <v-spacer></v-spacer>

                   <v-btn flat @click="cancelMenu('boostMenu')">Cancel</v-btn>
                   <v-btn color="primary" flat @click="boostArticle">
                     <v-icon class="pr-1" >fas fa-rocket</v-icon> Boost
                   </v-btn>
                 </v-card-actions>

               </v-card>
             </v-form>

             <v-alert v-model="boostAlert" type="error" dismissible>
               Something went wrong. Try again later.
             </v-alert>

          </v-menu>


         </v-flex>
       </v-layout>
       <v-divider></v-divider>

       <v-layout row full-height>
         <v-container>

           <v-snackbar v-model="showInfoSnackbar" top>
            {{ editSubmitInfo }}
             <v-btn color="blue lighten-1" flat @click="snackbar = false">
               Close
             </v-btn>
           </v-snackbar>

           <delete-dialog itemType="post" :showDialog="showDeleteDialog"
            @close="showDeleteDialog = false" @confirm="deleteArticle">
          </delete-dialog>

           <v-layout row class="edit-tools" v-if="AuthUserIsOwner">
             <v-speed-dial v-model="fab"
              direction="top" transition="slide-y-transition">
                <template slot="activator">
                    <v-btn v-model="fab" color="blue darken-2"
                    dark fab>
                      <v-icon>build</v-icon>
                      <v-icon>close</v-icon>
                    </v-btn>
                </template>
                <v-btn fab dark small @click="editMode = true"
                  color="green lighten-1">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn fab dark small @click="showDeleteDialog = true"
                  color="red lighten-1">
                  <v-icon>delete</v-icon>
                </v-btn>
            </v-speed-dial>
           </v-layout>

           <v-layout row class="save-edits" v-show="editMode" justify-end>
             <v-fab-transition>

             <v-btn fab dark small @click="saveEdits"
               color="green">
               <v-icon>check</v-icon>
             </v-btn>
           </v-fab-transition>
           </v-layout>


           <v-layout row justify-center class="centered">
             <v-flex xs8>

               <v-card-title primary-title class="mb-2">
                  <v-layout row justify-center>
                    <div v-if="!editMode" class="headline">{{article.title}}</div>
                    <v-text-field v-else v-model="edit.title"></v-text-field>

                  </v-layout>

                </v-card-title>

                <initiator-display :userId="article.SourceId"
                :postDate="article.updatedAt" class="mb-3">
                </initiator-display>

               <v-img v-if="article.image" :src="article.image" contain class="rounded">
               </v-img>
             </v-flex>
           </v-layout>

           <v-layout row class="my-2" justify-center>
             <v-flex xs10>
               <v-card-text class="body-text">
                 <div v-if="!editMode">
                   <p v-if="article.body" class="sth">
                     {{article.body}}
                   </p>
                   <p v-else-if="article.description">
                     {{article.description}}
                   </p>
                 </div>

                 <div v-else>
                   <v-textarea v-model="edit.body" rows=16 auto-grow box
                   background-color="light-blue lighten-5">
                   </v-textarea>
                 </div>

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
import deleteConfirmationDialog from '@/components/DeleteConfirmationDialog'

import postServices from '@/services/postServices'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
   'initiator-display': initiatorDisplay,
   'assessment-collector': assessmentCollector,
   'source-selector': sourceSelector,
   'delete-dialog': deleteConfirmationDialog
  },
  props: {
    detailsNamespace: {
      type: String,
      required: true
    },
    filtersNamespace: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
      postBodySanitized: '',
      disableBoost: false,
      assessmentMenu: false,
      boostMenu: false,
      postCredibility: null,
      assessmentBody: '',
      assessmentValidityRules: [
        v => !!v || 'Assess the accuracy of the article'
      ],
      assessmentAlert: false,
      boostAlert: false,
      fab: false,
      editMode: false,
      edit: {body: '', title: ''},
      showDeleteDialog: false,
      showInfoSnackbar: false,
      editSubmitInfo: ''
    }
  },
  computed: {

    articleDetailsVisible: {
      get: function() {
        return this.drawerVisible;
      },
      set: function(newValue) {
        for (let menu of ['assessmentMenu', 'boostMenu'])
          this.$refs[menu].reset();

        this.setDrawerVisibility(newValue);
      }
    },
    AuthUserIsOwner: function() {
      return this.user && this.article.SourceId == this.user.id;
    },
    drawerVisible: function() {
      return this.state.drawerVisible;
    },
    article: function() {
      return this.state.article;
    },
    assessment: function() {
      return this.state.assessment;
    },
    ...mapGetters('auth', [
      'user'
    ]),
    ...mapState({
       state (state) {
         return state[this.detailsNamespace];
       }
     })

  },
  watch: {
    article: function(val) {

      this.editMode = false;
      this.edit.body = val.body;
      this.edit.title = val.title;

      this.getAuthUserPostAssessment()
      .then(() => {
        console.log('bade post ', this.assessment)
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
      });

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
    cancelMenu: function(menu) {
      //this.$refs[menu].resetValidation();
      this.$refs[menu].reset();
      this[menu] = false;
    },
    saveEdits: function() {
      this.editMode = false;
      postServices.editPost({postId: this.article.id}, this.edit)
      .then(res => {
        this.editSubmitInfo = "Post has been updated."
        this.updateStateArticle({postId: this.article.id})
        .then(() => {
          this.updateDisplayedArticle();
          this.showInfoSnackbar = true;
        })

      })
      .catch(err => {
        console.log(err)
        this.editSubmitInfo = "Something went wrong. Please try again later."
        this.showInfoSnackbar = true;
      })
    },
    deleteArticle: function() {
      postServices.deletePost({postId: this.article.id})
      .then(res => {
        this.editSubmitInfo = "Post has been deleted."
        this.showInfoSnackbar = true;
        this.removeArticle(this.article.id);
        this.setDrawerVisibility(false);
      })
      .catch(err => {
        console.log(err)
        this.editSubmitInfo = "Something went wrong. Please try again later."
        this.showInfoSnackbar = true;
      })
    },
    ...mapActions({
      setDrawerVisibility (dispatch, payload) {
        return dispatch(this.detailsNamespace + '/setDrawerVisibility', payload)
      },
      getAuthUserPostAssessment (dispatch, payload) {
        return dispatch(this.detailsNamespace + '/getAuthUserPostAssessment', payload)
      },
      postAuthUserAssessment (dispatch, payload) {
        return dispatch(this.detailsNamespace + '/postAuthUserAssessment', payload)
      },
      updateDisplayedArticle (dispatch, payload) {
        return dispatch(this.detailsNamespace + '/updateDisplayedArticle', payload)
      }
    }),
    ...mapActions({
      updateStateArticle (dispatch, payload) {
        return dispatch(this.filtersNamespace + '/updateStateArticle', payload)
      },
      removeArticle (dispatch, payload) {
        return dispatch(this.filtersNamespace + '/removeArticle', payload)
      }
    })
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
  white-space: pre-wrap;
}

.full-height {
  min-height: 100%;

}

.edit-tools {
  position: sticky;
  top: 90vh;
}

.save-edits {
  position: sticky;
  top: 90vh;
}
</style>
