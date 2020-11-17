<!--
 @fileoverview A component that holds a source list name and a checkbox. When the ... on a source card
 is clicked, a container is opened that contains as many SourceListLines as there are source lists.
 Checking or unchecking the checkbox next to the name of a source list indicates if the user wants to
 assign the source to certain source lists or remove the source from the lists.
-->
<template>

  <v-list-item dense >
    <v-list-item-content>
      <v-list-item-title>{{ list.name }}</v-list-item-title>
    </v-list-item-content>

    <v-list-item-action class="my-1">
      <v-checkbox dense v-model="sourceListPlacement"></v-checkbox>
    </v-list-item-action>

  </v-list-item>

</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
  },
  props: {
    source: {
      required: true
    },
    list: {
      required: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
    sourceListPlacement: {
      get: function() {
        return this.isSourceInList(this.list.id, this.source.id);
      },
      set: function(newValue) {
        if (newValue)
          this.addSourceToList({
            listId: this.list.id,
            source: this.source
          });
        else
          this.removeSourceFromList({
            listId: this.list.id,
            source: this.source
          });
      }
    },
    ...mapGetters('sourceLists', [
      'isSourceInList'
    ])
  },
  methods: {
    ...mapActions('sourceLists', [
      'addSourceToList',
      'removeSourceFromList'
    ])
  }
}

</script>
