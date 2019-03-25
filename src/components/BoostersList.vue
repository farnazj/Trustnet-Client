<template>
  <v-dialog v-model="visible" class="Sth"
      max-width="300" scrollable>
     <v-card max-height="400">
       <v-list two-line>
         <template v-for="source in boosters">
           <v-list-tile :key="source.id" avatar>
              <v-list-tile-avatar>
                <custom-avatar :user="source" :clickEnabled="true"></custom-avatar>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="source.userName"></v-list-tile-title>
                <v-list-tile-sub-title v-if="!source.systemMade"> {{sourceDisplayName(source)}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
       </v-list>
     </v-card>
  </v-dialog>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceHelpers from '@/mixins/sourceHelpers'
import { mapState, mapActions } from 'vuex'

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
     })
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

<style scoped>

</style>
