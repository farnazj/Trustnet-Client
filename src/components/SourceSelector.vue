<template>

  <v-autocomplete v-model="targets" :items="populationList" dense
  filled chips color="blue-grey lighten-2" :label="audienceLabel" :filter="filterFollowersLists"
  item-text="text" item-value="value" multiple :no-data-text="textWhenNoData">

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
          <v-list-item-subtitle>default is all</v-list-item-subtitle>
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
    population: {
      type: String
    }
  },
  data () {
    return {
      targets: []
    }
  },
  created() {
    if (!this.followers.length)
      this.fetchFollowers();
    if (!this.trustedSources)
      this.fetchTrusteds();
  },
  computed: {
    populationList: function() {

      let data = [];

      if (this.population ==  'followers') {
        if (this.sourceLists.length) {
          data.push({ header: 'Lists' });
          data.push(...this.convertToTextVal(this.sourceLists));
        }

        if (this.followers.length) {
          data.push({ divider: true });
          data.push({ header: 'Followers' });
          data.push(...this.convertToTextVal(this.followers));
        }
      }
      else if (this.population == 'trusteds') {
        if (this.trustedSources.length) {
          data.push({ header: 'Trusted Sources' });
          data.push(...this.convertToTextVal(this.trustedSources));
        }
      }

      return data;
    },
    textWhenNoData: function() {
      if (this.population == 'followers')
        return 'No lists or followers found';
      else if (this.population == 'trusteds')
        return 'You have not marked any source as trustworthy';
    },
    audienceLabel: function() {
      if (this.population == 'followers')
        return 'Select target audience';
      else if (this.population == 'trusteds')
        return 'Trusted sources you would like answers from';
    },
    ...mapState('relatedSources', [
     'followers',
     'trustedSources'
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
      'fetchFollowers',
      'fetchTrusteds'
    ])
  },
  mixins : [sourceHelpers]
}
</script>
