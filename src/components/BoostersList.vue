<template>
  <v-dialog v-model="visible" max-width="550" scrollable>
     <v-card >
       <v-card-title>
         <span class="title font-weight-light">Boosters info</span>
       </v-card-title>

       <v-card-text>
         <template v-for="boostObj in boosters">
           <v-layout row :key="boostObj.id" align-center class="py-1">
             <v-flex xs2>
               <custom-avatar :user="boostObj.booster" :clickEnabled="true"></custom-avatar>
             </v-flex>
             <v-flex xs5 class="body-2">
               {{sourceDisplayName(boostObj.booster)}}
             </v-flex>
             <v-flex xs5 class="grey--text text--darken-2">
               <span> Boosted to &#32;</span>
               <span v-if="!boostObj.Targets.length">everyone</span>
               <span v-else-if="boostObj.Targets[0].userName == user.userName">you</span>
               <span v-else> {{sourceDisplayName(boostObj.Targets[0])}}</span>
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
import sourceHelpers from '@/mixins/sourceHelpers'
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
    ...mapActions({
      setBoostersVisibility (dispatch, payload) {
        return dispatch(this.detailsNamespace + '/setBoostersVisibility', payload)
      }
    })
  },
  mixins: [sourceHelpers]

}
</script>
