<template>
  <v-row wrap v-show="articleDetailsVisible">
    <v-navigation-drawer v-model="articleDetailsVisible"
      temporary right width="1000" fixed disable-route-watcher>

     <v-card class="full-parent-height">

       <v-row class="pa-2" full-height align="center" no-gutters>

         <v-col>
           <v-icon large @click="articleDetailsVisible = false">clear</v-icon>
         </v-col>

         <v-col cols="4" class="right-align">

           <v-menu v-model="assessmentMenu"
             :close-on-content-click="false"
             nudge-width="350" offset-y left attach>

             <template v-slot:activator="{ on }">
                <v-btn text icon color="blue darken-1" v-on="on"
                 class="mr-4">
                  <v-icon >gavel</v-icon>
                </v-btn>
              </template>

             <v-form ref="assessmentMenu" lazy-validation>
               <v-card>
                 <v-container fluid>
                   <assessment-collector ref="assessmentColl" :validityRules="assessmentValidityRules"
                     :postCredibility="postCredibility" :assessmentBody="assessmentBody" :assessmentId="assessment.id">
                   </assessment-collector>
                 </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text @click="cancelMenu('assessmentMenu')">Cancel</v-btn>
                  <v-btn color="primary" text @click="postAssessment">
                    <v-icon class="pr-1" >gavel</v-icon> Assess
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>

            <v-alert v-model="assessmentAlert" type="error" dismissible>
              Something went wrong. Try again later.
            </v-alert>

          </v-menu>

          <v-tooltip bottom :disabled="!disableBoost" >
            <template v-slot:activator="{ on }">

           <v-menu v-model="boostMenu"
             :close-on-content-click="false" :disabled="disableBoost"
             max-width="380" offset-y left attach>

             <template v-slot:activator="{ on }">
             <v-btn text icon color="blue darken-1" :class="['mr-4', {'reset-pointer-events': !disableBoost},
              {'v-btn--disabled': disableBoost }]" v-on="on">
               <v-icon >fas fa-share</v-icon>
             </v-btn>
            </template>

            <v-form ref="boostMenu" lazy-validation>
             <v-card >
               <v-container fluid>
                 <v-row no-gutters>
                   <v-col cols="12">
                     <!-- <span>Select your target audience or leave this empty to
                       include everyone</span> -->
                     <source-selector ref="boostTargets" class="mt-2">
                     </source-selector>
                   </v-col>
                 </v-row>
               </v-container>

                 <v-card-actions>
                   <a :href="emailLink" class="ml-1 email-link">
                    <v-icon small color="primary">email</v-icon>
                   </a>

                   <v-spacer></v-spacer>

                   <v-btn text @click="cancelMenu('boostMenu')">Cancel</v-btn>
                   <v-btn color="primary" text @click="boostArticle">
                     <v-icon class="pr-1" >fas fa-share</v-icon> Share
                   </v-btn>
                 </v-card-actions>

               </v-card>
             </v-form>

             <v-alert v-model="boostAlert" type="error" dismissible>
               Something went wrong. Try again later.
             </v-alert>

            </v-menu>
          </template>

          <span>To share the article, first you need to assess it.</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-row no-gutters class="full-parent-height">
     <v-container>

       <v-snackbar v-model="showInfoSnackbar" top>
        {{ editSubmitInfo }}
         <v-btn color="blue lighten-1" text @click="snackbar = false">
           Close
         </v-btn>
       </v-snackbar>

       <delete-dialog itemType="post" :showDialog="showDeleteDialog"
        @close="showDeleteDialog = false" @confirm="deleteArticle">
       </delete-dialog>

       <v-row no-gutters class="edit-tools" v-if="AuthUserIsOwner">
         <v-speed-dial v-model="fab"
          direction="top" transition="slide-y-transition">
            <template v-slot:activator>
              <v-btn v-model="fab" color="blue darken-2"
              dark fab large>
                <v-icon v-if="fab">close</v-icon>
                <v-icon v-else>build</v-icon>
              </v-btn>
            </template>

            <v-btn fab dark @click="editMode = true"
              color="green lighten-1">
              <v-icon>edit</v-icon>
            </v-btn>

            <v-btn fab dark @click="showDeleteDialog = true"
              color="red lighten-1">
              <v-icon>delete</v-icon>
            </v-btn>

          </v-speed-dial>
        </v-row>

        <v-row no-gutters class="save-edits" v-show="editMode" justify="end">
          <v-fab-transition>
            <v-btn fab dark @click="saveEdits"
             color="green">
             <v-icon>check</v-icon>
            </v-btn>
          </v-fab-transition>
        </v-row>

         <v-row no-gutters justify="center" class="centered">
           <v-col cols="8">

             <v-card-title primary-title class="mb-2">
                <v-row no-gutters justify="center">
                  <div v-if="!editMode" class="headline break-word">{{article.title}}</div>
                  <v-text-field v-else v-model="edit.title"></v-text-field>
                </v-row>
              </v-card-title>

              <initiator-display :userId="article.SourceId"
              :postDate="article.updatedAt" class="mb-3">
              </initiator-display>

             <v-img v-if="article.image" :src="article.image" contain class="rounded">
             </v-img>
           </v-col>
         </v-row>

         <v-row no-gutters class="my-2" justify="center">
           <v-col cols="10">
             <v-card-text class="body-text">
               <div v-if="!editMode">
                 <p v-if="article.body" class="body-1" v-html="article.body">

                 </p>
                 <p v-else-if="article.description" class="body-1">
                   {{article.description}}
                 </p>
               </div>

               <div v-else>
                 <v-textarea v-model="edit.body" rows=16 auto-grow filled
                 background-color="blue lighten-5">
                 </v-textarea>
               </div>

             </v-card-text>

           </v-col>
         </v-row>

         <v-row no-gutters justify="center" class="mt-2 mb-3">
           <v-col cols="6">
             <v-card-actions v-if="article.url">
               <v-btn outlined block color="blue darken-1"
                :href="article.url" target="_blank">
                 Visit Website</v-btn>

             </v-card-actions>
           </v-col>
         </v-row>

         <v-divider></v-divider>

         <v-row no-gutters class="mt-2" justify="center">
          <div class="fb-comments ma-1" :data-href="articleLink"
          data-width="500" data-numposts="5"></div>
         </v-row>

        </v-container>

      </v-row>

     </v-card>

   </v-navigation-drawer>
  </v-row>

</template>

<script>
import initiatorDisplay from '@/components/InitiatorDisplay'
import assessmentCollector from '@/components/AssessmentCollector'
import sourceSelector from '@/components/SourceSelector'
import deleteConfirmationDialog from '@/components/DeleteConfirmationDialog'

import postServices from '@/services/postServices'
import consts from '@/services/constants'
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
      assessmentValidityRules: {
        selectRules: [
          v => !!v || 'Assess the accuracy of the article'
        ],
        bodyRules: [
          v => !!v || 'You should add your reasoning'
        ]
      },
      assessmentAlert: false,
      boostAlert: false,
      fab: false,
      editMode: false,
      edit: {body: '', title: ''},
      showDeleteDialog: false,
      showInfoSnackbar: false,
      editSubmitInfo: '',
      emails: null
    }
  },
  created() {
    this.prepopulateUserAssessment();
  },
  computed: {
    articleDetailsVisible: {
      get: function() {
        return this.drawerVisible;
      },
      set: function(newValue) {
        for (let menu of ['assessmentMenu', 'boostMenu']) {
          if (this.$refs[menu])
            this.$refs[menu].reset();
        }

        this.setDrawerVisibility(newValue);
      }
    },
    // facebookCommentsURL: function() {
    //   return consts.FB_COMMENTS_BASE_URL + '/' + this.article.id;
    // },
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
    articleLink: function() {
      return consts.BASE_URL + '/posts/' + this.article.id;
    },
    emailLink: function() {
      return 'mailto:?subject=' + encodeURI('On ' + consts.SITE_NAME + '.com: ' +
      this.article.title + '&body=On ' + consts.SITE_NAME + '.com: ' + this.article.title +
       '\n\n' + this.article.description + '\n\n' +
       'Visit the link to see the article and its assessments:\n' + this.articleLink);
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

      this.prepopulateUserAssessment();
    },
    facebookCommentsURL: function() {
      setTimeout(function() {
        window.FB.XFBML.parse();
      }, 100)
    }
  },
  methods: {
    postAssessment: function() {
      if (this.$refs.assessmentMenu.validate()) {
        let reqBody = {
          postCredibility: this.$refs.assessmentColl.credibility - 2,
          body: this.$refs.assessmentColl.assessmentText
        }

        this.postAuthUserAssessment(reqBody)
        .then(() => {
          this.assessmentMenu = false;
          this.disableBoost = false;
          this.updateStateArticle({postId: this.article.id});
          this.$emit('assessmentUpdate');
          this.prepopulateUserAssessment();
        })
        .catch(err => {
          this.assessmentAlert = true;
        })

      }
    },
    prepopulateUserAssessment: function() {

      this.getAuthUserPostAssessment()
      .then(() => {

        if (Object.entries(this.assessment).length != 0) {
            this.disableBoost = false;
            this.assessmentBody = this.assessment.body;
            this.postCredibility = parseFloat(this.assessment.postCredibility);
          }
          else {
            this.disableBoost = true;
            this.assessmentBody = '';
            this.postCredibility = null;
            if (this.$refs.assessmentMenu)
              this.$refs.assessmentMenu.resetValidation();
          }
      });
    },
    getSelectedUsernamesAndLists: function() {

      let lists = this.$refs.boostTargets.targets.filter(el =>
        el.type === 'List').map(el => el.identifier);
      let usernames = this.$refs.boostTargets.targets.filter(el =>
        el.type === 'Source').map(el => el.identifier);

      return { usernames: usernames, lists: lists };
    },
    boostArticle: function() {

      if (this.$refs.boostMenu.validate()) {

        let targets = this.getSelectedUsernamesAndLists();
        let reqBody = {
          post_id: this.article.id,
          target_usernames: targets.usernames,
          target_lists: targets.lists
        };

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
          this.updateDisplayedArticle({namespace: this.filtersNamespace});
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
        this.showDeleteDialog = false;
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
  color: #212121 !important;
}

.full-parent-height {
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

.reset-pointer-events {
  pointer-events: auto !important;
}

.align-initial {
  text-align: initial;
}

.email-link {
  text-decoration: none;
}

</style>
