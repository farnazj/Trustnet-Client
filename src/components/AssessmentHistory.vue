<template>
  <v-dialog v-model="visible" max-width="550" scrollable>
     <v-card max-height="50vh">
       <v-layout row align-center class="pa-1" >
         <v-flex xs11>
           <v-layout row justify-start>
             <p class="pb-0 mb-0 subheading font-weight-regular">Edit History</p>
           </v-layout>
         </v-flex>
         <v-flex xs1>
           <v-layout row justify-end>
             <v-icon @click="hideHistory">clear</v-icon>
           </v-layout>
         </v-flex>
       </v-layout>

       <v-divider></v-divider>

       <v-card-text>

         <v-layout row justify-start align-center class="pb-3">
           <custom-avatar :user="historyOwner" :clickEnabled="true" class="mr-2">
           </custom-avatar>
            <span>{{sourceDisplayName(historyOwner)}}</span>
         </v-layout>

         <template v-for="assessment in assessmentHistory">
           <v-layout row :key="assessment.id" align-center class="py-1">
            <v-flex xs12>
              <p class="font-italic font-weight-light mb-0">{{validityMapping(assessment.postCredibility)}}</p>
              <p v-if="assessment.body">
                {{assessment.body}}
              </p>
              <span class="caption grey--text text--darken-2">{{timeElapsed(assessment.createdAt)}}</span>

            </v-flex>
         </v-layout>
         <v-divider></v-divider>

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
    }
  },
  computed: {
    visible: {
      get: function() {
        return this.state.historyVisiblity;
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
    validityMapping: function(val){
      if (val < 0)
        return 'This article is inaccurate.';
      else if (val == 0)
        return 'I want to know about the validity of this article.';
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
