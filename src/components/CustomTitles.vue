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

     <v-card max-height="50vh" class="pa-1" >
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

       <v-card-text>

       <v-row no-gutters justify="end">
         <v-card-actions >
           <v-btn outlined small color="primary" @click="postNewTitle">Submit</v-btn>
         </v-card-actions>
       </v-row>

       <v-divider></v-divider>

       <template v-for="(titleObj, index) in titles">
         <v-row no-gutters align="center" class="py-1">
           <custom-avatar :user="titleObj.author" :clickEnabled="true"></custom-avatar>
           <span class="ml-2 caption grey--text text--darken-3"> {{timeElapsed(titleObj.lastVersion.createdAt)}} </span>
           <span v-if="titleObj.history.length" class="ml-2 caption grey--text text--darken-1 cursor-pointer"
            @click.stop="showHistory(titleObj)">Edited</span>
          </v-row>

          <v-row no-gutters>
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

          <v-row no-gutters class="py-1">
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

            <v-col cols="11" v-if="titleObj.author.id == user.id">

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

          <v-divider></v-divider>

        </template>

      </v-card-text>
     </v-card>

     <title-history :namespace="titlesNamespace"></title-history>

  </v-dialog>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import deleteConfirmationDialog from '@/components/DeleteConfirmationDialog'
import titleHistory from '@/components/TitleHistory'

import sourceHelpers from '@/mixins/sourceHelpers'
import timeHelpers from '@/mixins/timeHelpers'
import titleHelpers from '@/mixins/titleHelpers'
import postServices from '@/services/postServices'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar,
   'delete-dialog': deleteConfirmationDialog,
   'title-history': titleHistory
  },
  props: {
    titlesNamespace: {
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
    titleDialogVisible: {

      get: function() {
        return this.state.customTitlesVisible;
      },
      set: function(newValue) {
        this.setHistoryVisiblity(false);
        this.setTitlesVisibility(newValue);
      }
    },
    ...mapGetters('auth', [
      'user'
    ])
  },
  methods: {
    postNewTitle: function() {

      if (this.$refs.newTitleForm.validate()) {

        postServices.postCustomTitle({ postId: this.postId}, { text: this.newTitle })
        .then(res => {
          this.newTitle = '';
          this.$refs.newTitleForm.resetValidation();
          this.fetchCustomTitles()
          .then(res => {
            this.populateTitles(this.titleObjects);
          })
        })
        .catch(err => {
          this.alertMessage = err.response.data.message;
          this.alert = true;
        })
      }
    },
    changeEndorsement: function(titleObj, arrIndex, endorsementVal) {
      postServices.setEndorsementStatus({
        setId: titleObj.lastVersion.setId
      },
      {
        endorse_status: endorsementVal
      })
      .then(res => {
        postServices.hasUserEndorsedTitle({ setId: titleObj.lastVersion.setId })
        .then(res => {
          titleObj['userEndorsed'] = res.data;
          this.$set(this.titleObjects, arrIndex, titleObj);

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
        let index = this.titleObjects.findIndex(title => title.lastVersion.setId == this.edit.setId);
        this.$refs.editTitleForm[index].resetValidation();
        this.resetEdits();
      }

      postServices.deleteCustomTitle({
        postId: this.postId,
        setId: this.delete.selectedTitle.lastVersion.setId
      })
      .then(res => {
        this.delete.selectedTitle = null;
        this.fetchCustomTitles()
        .then(res => {
          this.populateTitles(this.titleObjects);
        })
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

      let index = this.titleObjects.findIndex(title => title.lastVersion.setId == this.edit.setId);

      if (this.$refs.editTitleForm[index].validate()) {

        postServices.editCustomTitle({
          postId: this.postId,
          setId: this.edit.setId
        }, {text: this.edit.text})
        .then(res => {

          this.resetEdits();
          this.$refs.editTitleForm[index].resetValidation();
          this.fetchCustomTitles()
          .then(res => {
            this.populateTitles(this.titleObjects);
          })
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

      this.populateTitleHistory(titleObj);
      this.setHistoryVisiblity(true);
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
      }
    })
  },
  mixins: [timeHelpers, titleHelpers]
}
</script>
