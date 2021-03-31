<!--
 @fileoverview The component containing the different source list cards, the full source list dialog,
 and the create new list tile.
-->
<template>
  <v-container fluid>
    <v-snackbar v-model="showInfoSnackbar" top>
     {{ sourceListInfo }}
      <v-btn color="blue lighten-1" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <delete-dialog itemType="list" :showDialog="showDeleteDialog"
    @close="cancelListDelete" @confirm="removeListCard">
    </delete-dialog>

    <add-list-dialog :showDialog="showAddListDialog" @close="showAddListDialog = false"
      @confirm="concludeAddList" ref="addListDialogRef">
    </add-list-dialog>

    <v-dialog v-model="fullListDialog" scrollable :max-width="$vuetify.breakpoint.smAndDown ? '33%' : '25%'">
      <source-list-card :list="displayedFullList" :isPreview=false
       @delete="confirmListRemoval"
      ></source-list-card>
    </v-dialog>

    <v-row no-gutters>
      <v-container fluid>
        <v-row >
          <v-col sm="6" md="4" lg="3" xl="2" cols="12">
            <v-card outlined @click="showAddListDialog = true"
            class="interactable dashed-border">
              <v-row no-gutters align="center" justify="center" class="create-new-list">
                <v-icon large>add</v-icon>
                Create new list
              </v-row>
                <v-row no-gutters align="center" justify="center" class="caption pa-2">
                  You can add sources to and remove them from each list by clicking on the ... on a source card.
              </v-row>
            </v-card>
          </v-col>

          <v-col v-for="list in sourceLists" :key="list.id" sm="6" md="4" lg="3" xl="2" cols="12">
            <source-list-card :list="list" :isPreview=true
            @delete="confirmListRemoval"
            @showList="showFullList" @errorOccured="showError"
            ></source-list-card>
          </v-col>
        </v-row>
      </v-container>
    </v-row>

  </v-container>
</template>

<script>
import sourceListCard from '@/components/SourceListCard'
import addListDialog from '@/components/AddListDialog'
import deleteConfirmationDialog from '@/components/DeleteConfirmationDialog'
import sourceListServices from '@/services/sourceListServices'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'source-list-card': sourceListCard,
    'add-list-dialog': addListDialog,
    'delete-dialog': deleteConfirmationDialog
  },
  data() {
    return {
      showAddListDialog: false,
      showInfoSnackbar: false,
      sourceListInfo: '',
      listIdToRemove: null,
      showDeleteDialog: false
    }
  },
  created() {
    if (!this.sourceLists.length)
      this.fetchLists();
  },
  computed: {

    fullListDialog: {
      get: function() {
        return this.isFullListDisplayed;
      },
      set: function(newValue) {
        this.setFullListVisibility(newValue);
      }
    },
    ...mapState('sourceLists', [
      'sourceLists',
      'isFullListDisplayed',
      'displayedFullList'
    ])
  },
  methods: {

    concludeAddList: function(name) {
      this.addList({ listName: name })
      .then(() => {
        this.$refs.addListDialogRef.resetForm();
        this.showAddListDialog = false;
      })
      .catch(err => {
        this.sourceListInfo = err.response.data.message;
        this.showInfoSnackbar = true;
      })
    },

    confirmListRemoval: function(listId) {
      this.listIdToRemove = listId;
      this.showDeleteDialog = true;
    },

    removeListCard: function() {
      this.removeList({
        listId: this.listIdToRemove
      })
      .then(() => {
        this.showDeleteDialog = false;
        this.listIdToRemove = null;
      })
      .catch(err => {
        this.sourceListInfo = err.response.data.message;
        this.showInfoSnackbar = true;
      })
    },
    cancelListDelete: function() {
      this.showDeleteDialog = false;
      this.listIdToRemove = null;
    },
    showFullList: function(list) {

      this.populateDisplayedList(list);
      this.setFullListVisibility(true);
    },
    showError: function(err) {
      this.sourceListInfo = err.message;
      this.showInfoSnackbar = true;
    },
    ...mapActions('sourceLists', [
      'fetchLists',
      'addList',
      'removeList',
      'setFullListVisibility',
      'populateDisplayedList'
    ])
  }
}
</script>

<style scoped>
.create-new-list {
  min-height:200px;
}
</style>
