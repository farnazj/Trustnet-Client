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

         <template v-for="assessment in assessmentHistory">
           <v-row :key="assessment.id" align="center" class="py-1" no-gutters>
            <v-col cols="12" class="pa-1">
              <p class="font-italic font-weight-light mb-0">{{accuracyMapping(assessment.postCredibility)}}</p>
              <p class="mb-1" v-if="assessment.body">
                {{assessment.body}}
              </p>
              <span class="caption grey--text text--darken-2">{{timeElapsed(assessment.createdAt)}}</span>
              <span v-if="assessment.isTransitive" class="ml-2 font-weight-light caption grey--text text--darken-1">
                Adopted through their network
              </span>
            </v-col>
          </v-row>
          <v-divider :key="`divider-${assessment.id}`"></v-divider>

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
    namespace: {
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
        return this.state.historyVisibility;
      },
      set: function(newValue) {
        this.setHistoryVisibility(newValue);
      }
    },
    historyOwner: function() {
      return this.state.historyOwner;
    },
    assessmentHistory: function() {
      return this.state.assessmentHistory;
    },
    ...mapState({
      state (state) {
       return state[this.namespace];
      }
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
      this.setHistoryVisibility(false);
    },
    ...mapActions({
      setHistoryVisibility (dispatch, payload) {
        return dispatch(this.namespace + '/setHistoryVisibility', payload)
      }
    })
  },
  mixins: [timeHelpers, sourceHelpers]

}
</script>
