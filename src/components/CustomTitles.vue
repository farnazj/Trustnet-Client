<template>

  <v-dialog v-model="titleDialogVisible" max-width="600" scrollable>
    <v-snackbar v-model="alert" top>
     {{ alertMessage }}
      <v-btn color="blue lighten-1" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <delete-dialog itemType="title" :showDialog="showDeleteDialog"
     @close="cancelDelete" @confirm="proceedDelete">
    </delete-dialog>

    <v-slide-x-reverse-transition>

     <v-card  class="pa-1 custom-titles-container-card" max-width="100%" max-height="50vh">
       <v-row no-gutters align="center">
         <v-col cols="11">
           <v-row no-gutters justify="start">
             <p class="pb-0 mb-0 subheading font-weight-regular">Alternative Titles</p>
           </v-row>
         </v-col>
         <v-col cols="1">
           <v-row no-gutters justify="end">
             <v-icon @click="titleDialogVisible = false">clear</v-icon>
           </v-row>
         </v-col>
       </v-row>

       <v-divider></v-divider>

       <v-row no-gutters class="pa-1">
         <v-col cols="12">
           <v-form ref="newTitleForm" lazy-validation>
             <v-text-field v-model="newTitle" label="Suggest alternative title"
             required :rules="formsRules.newTitleRules">
             </v-text-field>
          </v-form>
         </v-col>
       </v-row>

       <v-card-text class="pa-1">

       <v-row no-gutters justify="end">
         <v-card-actions >
           <v-btn outlined small color="primary" @click="postNewTitle">Submit</v-btn>
         </v-card-actions>
       </v-row>

       <v-divider v-if="titles.length"></v-divider>

       <template v-for="(titleObj, index) in titles">
         <v-row no-gutters align="center" class="py-1" :key="`meta-info-${index}`">
           <custom-avatar :user="titleObj.author" :clickEnabled="true"></custom-avatar>
           <span class="ml-2 caption grey--text text--darken-3"> {{timeElapsed(titleObj.lastVersion.createdAt)}} </span>
           <span v-if="titleObj.history.length" class="ml-2 caption grey--text text--darken-1 cursor-pointer"
            @click.stop="showHistory(titleObj)">Edited</span>
          </v-row>

          <v-row no-gutters :key="`title-text-${index}`">
            <v-col cols="12">
              <v-form ref="editTitleForm" lazy-validation>
                <div v-if="titleObj.author.id == user.id && edit.on && edit.setId == titleObj.lastVersion.setId">
                  <v-text-field v-model="edit.text" background-color="blue lighten-5"
                  required :rules="formsRules.titleEditRules">
                  </v-text-field>
                </div>
              <div v-else>
                <p class="grey--text text--darken-3 mb-1">{{titleObj.lastVersion.text}}</p>
              </div>
              </v-form>
            </v-col>
          </v-row>

          <v-row no-gutters class="py-1" :key="`title-actions-${index}`">
            <v-col cols="1">
              <v-icon @click="changeEndorsement(titleObj, index, false)"
              v-if="titleObj.userEndorsed" color="primary" class="xs-icon-font cursor-pointer">
                fas fa-thumbs-up
              </v-icon>
              <v-icon @click="changeEndorsement(titleObj, index, true)" v-else
              color="primary" class="xs-icon-font cursor-pointer">
                far fa-thumbs-up
              </v-icon>
            </v-col>

            <v-col cols="5">
                <v-row no-gutters v-if="titleObj.sortedEndorsers.length" @click.stop="showEndorsers(titleObj)" class="interactable">
                    <template v-for="(endorser, endorserIndex) in titleObj.sortedEndorsers.slice(0, endorsersOnCard)">
                        <custom-avatar :user="endorser" :size="25" :clickEnabled="false" :key="`endorser-${endorserIndex}`"
                        class="mr-2"></custom-avatar>
                    </template>
                    <span v-if="titleObj.sortedEndorsers.length > endorsersOnCard" 
                        :class="{'mr-2': $vuetify.breakpoint.smAndDown}" >...</span>
                </v-row>
            </v-col>

            <v-col cols="6" v-if="titleObj.author.id == user.id">

              <v-row justify="end" no-gutters>
                <v-tooltip bottom :open-on-hover="true" open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn v-show="!edit.on || edit.setId != titleObj.lastVersion.setId" x-small outlined
                      @click="startEdit(titleObj)" v-on="on" color="green lighten-1" class="mr-2">
                      <v-icon class="xs-icon-font">edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit</span>
                </v-tooltip>

                <v-tooltip bottom :open-on-hover="true" open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn v-show="edit.on && edit.setId == titleObj.lastVersion.setId" x-small outlined
                      @click="resetEdits" v-on="on" color="red lighten-1" class="mr-1">
                      <v-icon class="xs-icon-font">cancel</v-icon>
                    </v-btn>
                  </template>
                  <span>Cancel edit</span>
                </v-tooltip>

                <v-tooltip bottom :open-on-hover="true" open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn v-show="edit.on && edit.setId == titleObj.lastVersion.setId" x-small outlined
                      @click="saveEdits" v-on="on" color="green lighten-1" class="mr-3">
                      <v-icon class="xs-icon-font">check</v-icon>
                    </v-btn>
                  </template>
                  <span>Save edit</span>
                </v-tooltip>

                <v-tooltip bottom :open-on-hover="true" open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn x-small outlined @click="startDelete(titleObj)" v-on="on"
                      color="red lighten-1">
                      <v-icon class="xs-icon-font">delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>

              </v-row>
            </v-col>
          </v-row>

          <v-divider :key="`title-divider-${index}`"></v-divider>

        </template>

      </v-card-text>
     </v-card>
     </v-slide-x-reverse-transition>

      <title-history :namespace="titlesNamespace"></title-history>
      <title-endorsers :namespace="titlesNamespace"></title-endorsers>

  </v-dialog>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import deleteConfirmationDialog from '@/components/DeleteConfirmationDialog'
import titleHistory from '@/components/TitleHistory'
import titleEndorsers from '@/components/TitleEndorsers'

import timeHelpers from '@/mixins/timeHelpers'
import titleHelpers from '@/mixins/titleHelpers'
import titleServices from '@/services/titleServices'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar,
   'delete-dialog': deleteConfirmationDialog,
   'title-history': titleHistory,
    'title-endorsers': titleEndorsers
  },
  props: {
    titlesNamespace: {
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
      newTitle: '',
      edit: {
        on: false,
        setId: null,
        text: ''
      },
      showDeleteDialog: false,
      delete: {
        selectedTitle: null
      },
      formsRules: {
        newTitleRules: [
          v => !!v || 'Forgot to write the title?'
        ],
        titleEditRules: [
          v => !!v || 'Forgot to write the title?'
        ]
      },
      alert: false,
      alertMessage: ''

    }
  },
  computed: {
    associatedStandaloneTitle: function() {

        if (this.titleId) {
          return this.titles.find(title => title.id == this.standaloneTitleId);
        }
        else
          return null;
    },
    titleDialogVisible: {

      get: function() {
        return this.state.customTitlesVisible;
      },
      set: function(newValue) {
        this.setHistoryVisiblity(false);
        this.setEndorsersVisibility(false);
        this.setTitlesVisibility(newValue);
      }
    },
    endorsersOnCard: function() {
      if (this.$vuetify.breakpoint.smAndDown)
          return 1;
      else if (this.$vuetify.breakpoint.mdAndDown)
          return 2;
      else 
          return 3;
    },
    ...mapGetters('auth', [
      'user'
    ])
  },
  methods: {
    postNewTitle: function() {

      if (this.$refs.newTitleForm.validate()) {

        titleServices.postCustomTitle({ postId: this.postId,
        customTitleText: this.newTitle,
        appRequest: true })
        .then(res => {         
          /*
          If the user's submitted custom title is the first every custom title submitted
          for the post, the post does not have an associated standaloneTitle with each and
          therefore the value of titleId in the titles module in the store is null.
          After submitting the custom title, the server returns the standaloneCustomTitle
          in the data field in its response and this component sets the titleId in the store's
          state to be the id in the data returned from the server.
          */
          if (!this.standaloneTitleId) {
            this.setTitleId(res.data.data.id)
            .then(() => {
              this.fetchPostTitles();
            })
          }
          else {
           this.fetchPostTitles();
          }

          this.newTitle = '';
          this.$refs.newTitleForm.resetValidation();
        })
        .catch(err => {
          console.log(err)
          this.alertMessage = err.response.data.message;
          this.alert = true;
        })
      }
    },
    changeEndorsement: function(titleObj, arrIndex, endorsementVal) {
      titleServices.setEndorsementStatus({
        setId: titleObj.lastVersion.setId
      },
      {
        endorse_status: endorsementVal
      })
      .then(res => {
        titleServices.hasUserEndorsedTitle({ setId: titleObj.lastVersion.setId })
        .then(res => {
          titleObj['userEndorsed'] = res.data;
          this.fetchPostTitles();
        })
      })
    },
    startDelete: function(titleObj) {
      this.delete.selectedTitle = titleObj;
      this.showDeleteDialog = true;
    },
    cancelDelete: function() {
      this.delete.selectedTitle = null;
      this.showDeleteDialog = false;
    },
    proceedDelete: function() {

      this.showDeleteDialog = false;

      if (this.edit && this.delete.selectedTitle.lastVersion.setId == this.edit.setId) {
        let index = this.titles.findIndex(title => title.lastVersion.setId == this.edit.setId);
        this.$refs.editTitleForm[index].resetValidation();
        this.resetEdits();
      }

      titleServices.deleteCustomTitle({
        standaloneTitleId: this.standaloneTitleId,
        setId: this.delete.selectedTitle.lastVersion.setId
      })
      .then(res => {
        this.delete.selectedTitle = null;
        this.fetchPostTitles();
      })
      .catch(err => {
        this.alertMessage = err.response.data.message;
        this.alert = true;
      })

    },
    startEdit: function(title) {

      this.edit.on = true;
      this.edit.setId = title.lastVersion.setId;
      this.edit.text = title.lastVersion.text;
    },
    saveEdits: function() {

      let index = this.titles.findIndex(title => title.lastVersion.setId == this.edit.setId);

      if (this.$refs.editTitleForm[index].validate()) {

        titleServices.editCustomTitle({
          standaloneTitleId: this.standaloneTitleId,
          setId: this.edit.setId
        }, { text: this.edit.text })
        .then(res => {

          this.resetEdits();
          this.$refs.editTitleForm[index].resetValidation();
          this.fetchPostTitles();
        })
        .catch(err => {
          this.alertMessage = err.response.data.message;
          this.alert = true;
        })
      }

    },
    resetEdits: function() {

      this.edit.on = false;
      this.edit.setId = null;
      this.edit.text = '';
    },
    showHistory: function(titleObj) {
      this.setEndorsersVisibility(false);
      this.populateTitleHistory(titleObj);
      this.setHistoryVisiblity(true);
    },
    showEndorsers: function(titleObj) {

      this.setHistoryVisiblity(false);
      this.setEndorsersTitleIds({
          selectedStandaloneTitleId: titleObj.lastVersion.StandaloneTitleId,
          selectedCustomTitleSetId: titleObj.lastVersion.setId
      })
      
      this.setEndorsersVisibility(true);
    },
    hideTitles: function() {
      this.setHistoryVisiblity(false);
      this.setTitlesVisibility(false);
    },
    ...mapActions({
      setTitlesVisibility (dispatch, payload) {
        return dispatch(this.titlesNamespace + '/setTitlesVisibility', payload)
      },
      populateTitleHistory (dispatch, payload) {
        return dispatch(this.titlesNamespace + '/populateTitleHistory', payload)
      },
      setHistoryVisiblity (dispatch, payload) {
        return dispatch(this.titlesNamespace + '/setHistoryVisibility', payload)
      },
      fetchPostTitles (dispatch) {
        return dispatch(this.titlesNamespace + '/fetchPostTitles', { 
          titlesNamespace: this.titlesNamespace,
          filtersNamespace: this.filtersNamespace
          })
      },
      setEndorsersVisibility (dispatch, payload) {
        return dispatch(this.titlesNamespace + '/setEndorsersVisibility', payload)
      },
      setEndorsersTitleIds (dispatch, payload) {
        return dispatch(this.titlesNamespace + '/setEndorsersTitleIds', payload)
      }

    })
  },
  mixins: [timeHelpers, titleHelpers]
}
</script>

<style scoped>
.custom-titles-container-card {
    overflow: auto;
    /* max-height: min(100%, 50vh); */
}
</style>