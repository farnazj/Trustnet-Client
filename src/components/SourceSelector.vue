<template>

  <v-autocomplete v-model="targets" :items="listsAndFollowers" dense
  filled chips color="blue-grey lighten-2" label="Select target audience" :filter="filterFollowersLists"
  item-text="text" item-value="value" multiple no-data-text="No lists or followers found">

    <template slot="selection" slot-scope="data" >
      <v-chip
        :input-value="data.selected" close
        class="chip--select-multi"
        @click:close="remove(data.item)" >

        <template>
          <v-avatar left v-if="data.item.value.type === 'Source'">
            <custom-avatar :user="data.item.value.SourceObj" :clickEnabled="false"></custom-avatar>
          </v-avatar>
          {{ data.item.text }}
        </template>

      </v-chip>
    </template>

    <template slot="item" slot-scope="data">

      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>

      <template v-else>

        <v-list-item-avatar v-if="data.item.value.type === 'Source'" class="custom-list-avatar">
          <custom-avatar :user="data.item.value.SourceObj" :clickEnabled="false"
          :size="36"></custom-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.text"></v-list-item-title>
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
    listsAndFollowers: function() {

      let data = [];

      if (this.sourceLists.length) {
        data.push({ header: 'Lists' });
        data.push(...this.convertToTextVal(this.sourceLists));
      }

      if (this.followers.length) {
        data.push({ divider: true });
        data.push({ header: 'Followers' });
        data.push(...this.convertToTextVal(this.followers));
      }

      return data;
    },
    ...mapState('relatedSources', [
     'followers'
   ]),
   ...mapState('sourceLists', [
     'sourceLists'
   ])
  },
  methods: {
    convertToTextVal: function(entityList) {
      return entityList.map(el => {
        let isSource = typeof el.userName !== 'undefined';

        let dataObj = {
          text: isSource ? this.sourceDisplayName(el) : el.name,
          value: {
            type: isSource ? 'Source' : 'List',
            identifier: isSource ? el.userName : el.id
            }
        };

        if (isSource)
          dataObj.value.SourceObj = el;

        return dataObj;
      });
    },
    remove: function(item) {

      if (typeof item.value !== 'undefined') {
        const index = this.targets.map(el => el.identifier).indexOf(item.value.identifier);
        if (index > -1)
          this.targets.splice(index, 1);
      }
    },
    filterFollowersLists: function(item, queryText, itemText) {

      if (typeof item.value === 'undefined')
        return false;

        return item.text.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
    },
    ...mapActions('relatedSources', [
      'fetchFollowers'
    ])
  },
  mixins : [sourceHelpers]
}
</script>
