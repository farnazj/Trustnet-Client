<template>

  <v-autocomplete v-model="targets" :items="followers"
  filled chips color="blue-grey lighten-2" label="Select target audience" :filter="filterFollower"
  item-text="userName" item-value="userName" multiple no-data-text="No followers found">

    <template slot="selection" slot-scope="data" >
      <v-chip
        :selected="data.selected" close
        class="chip--select-multi"
        @input="remove(data.item)" >
        <v-avatar>
          <custom-avatar :user="data.item" :clickEnabled="false"></custom-avatar>
        </v-avatar>
      {{ sourceDisplayName(data.item) }}
      </v-chip>
    </template>

    <template slot="item" slot-scope="data">

      <template>
        <v-list-item-avatar>
          <custom-avatar :user="data.item" :clickEnabled="false"></custom-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="sourceDisplayName(data.item)"></v-list-item-title>
        </v-list-item-content>
      </template>

    </template>

    <template v-if="!targets.length" slot="append">
      <template>
        <v-list-item-content>
          <v-list-item-title>default is everyone</v-list-item-title>
        </v-list-item-content>
      </template>
    </template>

  </v-autocomplete>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import { mapState, mapActions } from 'vuex';
import sourceHelpers from '@/mixins/sourceHelpers'

export default {
  components: {
    'custom-avatar': customAvatar
  },
  props: {

  },
  data () {
    return {
      targets: []
    }
  },
  created() {
    if (!this.followers.length)
      this.fetchFollowers();
  },
  computed: {
    ...mapState('relatedSources', [
     'followers',
    ])
  },
  methods: {
    remove (item) {
      const index = this.targets.indexOf(item.userName)
      if (index >= 0) this.targets.splice(index, 1)
    },
    filterFollower (item, queryText, itemText) {
      return this.sourceDisplayName(item).toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
    },
    ...mapActions('relatedSources', [
      'fetchFollowers'
    ])
  },
  mixins : [sourceHelpers]
}
</script>
