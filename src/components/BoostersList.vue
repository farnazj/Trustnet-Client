<template>
  <v-dialog v-model="visible" max-width="700" scrollable>
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
             <v-col cols="3" class="body-2">
               {{sourceDisplayName(boostObj.booster)}}
             </v-col>
             <v-col cols="4" class="grey--text text--darken-2">
               <span> Shared with &#32;</span>
               <span v-if="!boostObj.Targets.length">everyone</span>
               <span v-else-if="boostObj.Targets[0].userName == user.userName">you</span>
               <span v-else>
                  <span v-for="(target, index) in boostObj.Targets" :key="`target-${target.id}`">
                    {{sourceDisplayName(target)}}<span v-if="index < boostObj.Targets.length - 1">,</span>
                  </span> 
                 </span>
             </v-col>

             <v-col cols="2">
               <span class="caption">{{timeElapsed(boostObj.createdAt)}}</span>
             </v-col>
            
            <v-col cols="1" v-if="user.id == boostObj.booster.id">
               <v-card-actions>
                <v-btn x-small outlined color="red lighten-1" @click.stop="deleteBoost(boostObj)">
                  <v-icon class="xs-icon-font">delete</v-icon>
                </v-btn>
              </v-card-actions>
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
import postServices from '@/services/postServices'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'custom-avatar': customAvatar
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
    deleteBoost: function(boostObj) {
      console.log(boostObj)
      postServices.deleteBoostByBoostId({ boostId: boostObj.id })
      .then(() => {
        console.log('delete shod')
        this.updateStateArticle({ postId: boostObj.PostId })
        .then(() => {
        })
      })
    },
    ...mapActions({
      setBoostersVisibility (dispatch, payload) {
        return dispatch(this.detailsNamespace + '/setBoostersVisibility', payload)
      },
      updateStateArticle (dispatch, payload) {
        return dispatch(this.filtersNamespace + '/updateStateArticle', payload)
      }
    })
  },
  mixins: [sourceHelpers, timeHelpers]

}
</script>
