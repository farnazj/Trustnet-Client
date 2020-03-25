<template>

  <v-row v-if="tags" :class="{'one-liner': compact}" no-gutters>
    <v-col cols="12">
      <v-chip v-for="tag in tags" :key="tag.id" :close="closable" @click:close="removeTagFromFilters(tag)"
      class="mr-2 mt-1 chip-custom" label @click.stop="addTagToFilters(tag)"
        :color="isTagChosen(tag) ? 'lime darken-1' : 'lime lighten-4'">
         {{tag.text}}
      </v-chip>
    </v-col>
  </v-row>

</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    tags: {
      type: Array,
      required: true
    },
    filtersNamespace: {
      type: String,
    },
    compact: {
      type: Boolean
    },
    closable: {
      type: Boolean
    }
  },
  data: () => {
    return {

    }
  },
  computed: {
    filteredTags: function() {
      return this.state.filteredTags;
    },
    ...mapState({
       state (state) {
         return state[this.filtersNamespace];
       }
    })
  },
  methods: {
    removeTagFromFilters: function(tag) {
      if (this.filteredTags.map(el => el.id).includes(tag.id)) {
        this.modifyFilterTags({
          add: false,
          tag
        });
      }

    },
    addTagToFilters: function(tag) {
      if (!this.filteredTags.map(el => el.id).includes(tag.id)) {
        this.modifyFilterTags({
          add: true,
          tag
        });
      }
    },
    ...mapActions({
      modifyFilterTags (dispatch, payload) {
        return dispatch(this.filtersNamespace + '/addOrRemoveTagInFilters', payload)
      }
    }),
    isTagChosen: function(tag) {
      if (this.filteredTags.map(el => el.id).includes(tag.id))
        return true;
      else
        return false;
    }

  }

}
</script>

<style scoped>
  .one-liner {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  .custom-chip {

  }
</style>
