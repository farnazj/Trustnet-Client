<template>
  <v-dialog v-model="visible" max-width="600" scrollable>
     <v-card max-height="50vh">

       <v-row align="center" class="pa-1" no-gutters>
         <v-col cols="11">
           <v-row justify="start" no-gutters>
             <p class="pb-0 mb-0 subheading font-weight-regular">Sharers info</p>
           </v-row>
         </v-col>
         <v-col cols="1">
           <v-row justify="end" no-gutters>
             <v-icon @click="hideBoosters">clear</v-icon>
           </v-row>
         </v-col>
       </v-row>

       <v-divider></v-divider>

       <v-card-text class="pa-1">
         <template v-for="(boostObj, index) in boosters">
           <v-row :key="`item-${boostObj.id}`" no-gutters align="center" class="py-2">
             <v-col cols="2">
               <custom-avatar :user="boostObj.booster" :clickEnabled="true"></custom-avatar>
             </v-col>
             <v-col cols="4" class="body-2">
               {{sourceDisplayName(boostObj.booster)}}
             </v-col>
             <v-col cols="4" class="grey--text text--darken-2">
               <span> Shared with &#32;</span>
               <span v-if="!boostObj.Targets.length">everyone</span>
               <span v-else-if="boostObj.Targets[0].userName == user.userName">you</span>
               <span v-else> {{sourceDisplayName(boostObj.Targets[0])}}</span>
             </v-col>

             <v-col cols="2">
               <span class="caption">{{timeElapsed(boostObj.createdAt)}}</span>
             </v-col>
           </v-row>
           <v-divider :key="`divider-${boostObj.id}`" v-if="index != boosters.length - 1"></v-divider>
         </template>
       </v-card-text>

     </v-card>
  </v-dialog>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceHelpers from '@/mixins/sourceHelpers'
import timeHelpers from '@/mixins/timeHelpers'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'custom-avatar': customAvatar
  },
  props: {
    detailsNamespace: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
    }
  },
  computed: {
    visible: {
      get: function() {
        return this.state.boosterListVisible;
      },
      set: function(newValue) {
        this.setBoostersVisibility(newValue);
      }
    },
    boosters: function() {
      return this.state.boosters;
    },
    ...mapState({
       state (state) {
         return state[this.detailsNamespace];
       }
     }),
   ...mapGetters('auth', [
     'user'
   ]),
  },
  methods: {
    hideBoosters: function() {
      this.setBoostersVisibility(false);
    },
    ...mapActions({
      setBoostersVisibility (dispatch, payload) {
        return dispatch(this.detailsNamespace + '/setBoostersVisibility', payload)
      }
    })
  },
  mixins: [sourceHelpers, timeHelpers]

}
</script>
