<template>
  <v-dialog v-model="visible" max-width="550" scrollable>
     <v-card max-height="50vh">

       <v-row no-gutters align="center" class="pa-1" >
         <v-col cols="11">
           <v-row no-gutters justify="start">
             <p class="pb-0 mb-0 subheading font-weight-regular">Edit History</p>
           </v-row>
         </v-col>
         <v-col cols="1">
           <v-row no-gutters justify="end">
             <v-icon @click="hideHistory">{{icons.close}}</v-icon>
           </v-row>
         </v-col>
       </v-row>

       <v-divider></v-divider>

       <v-card-text>

         <v-row justify="start" align="center" class="pt-1" no-gutters>
           <custom-avatar :user="historyOwner" :clickEnabled="true" class="mr-2">
           </custom-avatar>
            <span>{{sourceDisplayName(historyOwner)}}</span>
         </v-row>

         <template v-for="item in history">
           <v-row :key="item.id" align="center" class="py-1">
            <v-col cols="12" class="pa-1">
              <p v-if="!engagementType" class="font-italic font-weight-light mb-0">{{accuracyMapping(item.postCredibility)}}</p>
              <p class="mb-1" v-if="item.body">
                {{item.body}}
              </p>
              <span class="caption grey--text text--darken-2">{{timeElapsed(item.createdAt)}}</span>
              <span v-if="!engagementType && item.isTransitive" class="ml-2 font-weight-light caption grey--text text--darken-1">
                Adopted through their network
              </span>
            </v-col>
          </v-row>
          <v-divider :key="`divider-${item.id}`" class="my-2"></v-divider>

         </template>
      </v-card-text>
     </v-card>
  </v-dialog>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import timeHelpers from '@/mixins/timeHelpers'
import sourceHelpers from '@/mixins/sourceHelpers'
import consts from '@/services/constants'
import { mapState, mapActions } from 'vuex'
import { mdiClose } from '@mdi/js';

export default {
  components: {
   'custom-avatar': customAvatar
  },
  props: {
    assessmentsNamespace: {
      type: String,
      required: true
    },
    commentsNamespace: {
      type: String,
      required: true
    },
  },
  data: () => {
    return {
      icons: {
        close: mdiClose
      }
    }
  },
  computed: {
    visible: {
      get: function() {
        return (this.assessmentState.historyVisibility || this.commentState.historyVisibility) ? true : false
      },
      set: function(newValue) {
        if (this.assessmentState.historyVisibility)
          this.setAssessmentHistoryVisibility(newValue);
        else
          this.setCommentHistoryVisibility(newValue);
      }
    },
    visibleState() {
      return this.assessmentState.historyVisibility ? this.assessmentState : this.commentState;
    },
    engagementType() {
      return this.assessmentState.historyVisibility ? 0 : 1;
    },
    historyOwner() {
      return this.visibleState.historyOwner;
    },
    history() {
      return this.visibleState.history;
    },
    ...mapState({
       assessmentState (state) {
         return state[this.assessmentsNamespace];
       },
       commentState (state) {
         return state[this.commentsNamespace];
       },
    })
  },
  methods: {
    accuracyMapping: function(val){
      if (val < 0)
        return 'This article is inaccurate.';
      else if (val == 0)
        return 'I want to know about the accuracy of this article.';
      else if (val > 0)
        return 'This article is accurate.'
    },
    hideHistory: function() {
      this.setAssessmentHistoryVisibility(false);
      this.setCommentHistoryVisibility(false);
    },
    ...mapActions({
      setAssessmentHistoryVisibility (dispatch, payload) {
        return dispatch(this.assessmentsNamespace + '/setHistoryVisibility', payload)
      },
      setCommentHistoryVisibility (dispatch, payload) {
        return dispatch(this.commentsNamespace + '/setHistoryVisibility', payload)
      }
    })
  },
  mixins: [timeHelpers, sourceHelpers]

}
</script>
