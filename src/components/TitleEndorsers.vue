<template>

<v-slide-x-reverse-transition v-if="visible">
  <v-card max-width="270" max-height="50vh" class="drawer-card">
    <v-row no-gutters >
      <v-col class="drawer-opener interactable" cols="1" @click="hideEndorsers">
        <v-row no-gutters justify="end" align="center" class="fill-height">
          <v-icon >{{icons.arrowRight}}</v-icon>
        </v-row>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col cols="10" class="pa-1">
        <v-row no-gutters justify="start">
          <p class="pb-0 mb-0 subheading font-weight-regular grey--text text--darken-3">Title Endorsers</p>
        </v-row>

        <v-divider></v-divider>

        <v-card-text class="pa-1">
          <template v-for="endorser in endorserUsers">
          <v-row  :key="`row-${endorser.id}`" no-gutters justify="start" align="center" class="pa-1">
            <custom-avatar :user="endorser" :clickEnabled="false" :size="25"  class="mr-2">
            </custom-avatar>
             <span class="grey--text text--darken-2">{{sourceDisplayName(endorser)}}</span>
          </v-row>
            <v-divider :key="`divider-${endorser.id}`"></v-divider>

          </template>
          
        </v-card-text>

      </v-col>

    </v-row>
  </v-card>
</v-slide-x-reverse-transition>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import timeHelpers from '@/mixins/timeHelpers'
import sourceHelpers from '@/mixins/sourceHelpers'
import { mapState, mapActions } from 'vuex'
import { mdiMenuRight } from '@mdi/js';

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
        arrowRight: mdiMenuRight
      }
    }
  },
  computed: {
    visible: {
      get: function() {
        return this.titleEndorsersState.endorsersVisibility;
      },
      set: function(newValue) {
        this.setEndorsersVisibility(newValue);
      }
    },
    endorserUsers: function() {
      let endorsers = this.titles.find(
        customTitle => customTitle.lastVersion.setId === this.titleEndorsersState.selectedCustomTitleSetId
      ).sortedEndorsers;

      return endorsers;
    },
    titleEndorsersState: function() {
        return this.state.titleEndorsersState;
    },
    titles: function() {
        return this.state.titles;
    },
    ...mapState({
      state (state) {
       return state[this.namespace];
      }
    })
  },
  methods: {

    hideEndorsers: function() {
      this.setEndorsersVisibility(false);
    },

    ...mapActions({
        setEndorsersVisibility(dispatch, payload) {
            return dispatch(`${this.namespace}/setEndorsersVisibility`, payload)
        }
    })
  },
  watch: {
    titleEndorsersState: function(newVal) {
      console.log(newVal)
    }
  },
  mixins: [timeHelpers, sourceHelpers]

}
</script>

<style scoped>

.drawer-opener {
  max-width: 25px;
}

.full-height{
  height: 100%;
}

.drawer-card {
  overflow: auto;
}
</style>
