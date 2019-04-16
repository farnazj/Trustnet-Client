<template>
  <v-card flat>

    <v-layout row>
      <v-flex xs6>
        <v-card-title>
          <v-text-field
            v-model="search" append-icon="search" label="Search sources"
            single-line hide-details></v-text-field>
        </v-card-title>

      </v-flex>
    </v-layout>

  <v-data-table v-model="selected" :headers="headers" select-all
      :items="followedOrTrusteds" :pagination.sync="pagination"
      select-all item-key="id" :search="search" class="elevation-1"
      :rows-per-page-items="rowsPerPage" >

      <template slot="headers" slot-scope="props">
        <tr>

          <th v-for="header in props.headers"
            :key="header.text" class="text-xs-left"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc',
             header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)" >

            <v-icon small>arrow_upward</v-icon>
            {{ header.text }}
          </th>


        </tr>
      </template>

      <template slot="items" slot-scope="props">
        <tr :active="props.selected" @click="props.selected = !props.selected">

          <td class="text-xs-left">
            <custom-avatar :user="props.item" :clickEnabled="true" class="mr-2"></custom-avatar>
            {{ props.item.userName }}
          </td>
          <td class="text-xs-left">{{ props.item.name }}</td>

          <td class="text-xs-left">

            <span v-if="props.item.trusted"> Trusted &#x2713;</span>
            <v-btn small flat :color="props.item.trusted ? 'grey darken-2' : 'light-green darken-3' "
              @click.stop="changeTrustStatus(props.item)">
              <span v-if="props.item.trusted"> Untrust</span>
              <span v-else> Trust</span>
            </v-btn>

          </td>

          <td>
            <v-btn small flat :color="props.item.followed ? 'grey darken-2' : 'primary' "
              @click.stop="changeFollowStatus(props.item)">
              <span v-if="props.item.followed"> Unfollow</span>
              <span v-else> Follow</span>
            </v-btn>
          </td>

        </tr>
      </template>

    </v-data-table>
  </v-card>

</template>


<script>
import customAvatar from '@/components/CustomAvatar'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'custom-avatar': customAvatar,
  },
  data () {
    return {
      headers: [
        { text: 'Username', value: 'userName' },
        { text: 'Name', value: 'name' },
        { text: 'Trust Status', value: 'trusted' },
        { text: 'Follow Status', value: 'followed'}
      ],
      pagination: {
        sortBy: '!trusted'
      },
      selected: [],
      search: '',
      rowsPerPage: [10, 30, 50, {"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]
    }
  },
  created() {
    if (!this.followed_sources.length)
      this.fetchFollows();
    if (!this.trusted_sources.length)
      this.fetchTrusteds();
  },
  computed: {
    relatedSourcesWInfo: function(){

      // let rest = this.followed_sources.filter(source =>
      //     !this.trustedSourcesIds.includes(source.id));
      //
      // let all_sources = [];
      // let trusteds = this.trusted_sources;
      //
      // for (let key of [trusteds, rest]) {
      //   all_sources.push(...key.map(source => {
      //    let new_source = Object.assign({},source);
      //    new_source.trusted = key == trusteds ? 1 : 0;
      //    new_source.name = source.systemMade ? source.userName : source.firstName + ' ' + source.lastName;
      //    return new_source;
      //  }));
      // }
      //
      // return all_sources;

    },
    ...mapState('relatedSources', [
     'followed_sources',
     'trusted_sources',
   ]),
   ...mapGetters('relatedSources', [
     'followedOrTrusteds',
     'trustedIds',
     'followedIds'
   ])
  },
  methods: {
    changeTrustStatus(source) {

      if (!this.trustedIds.includes(source.id)) {
        this.addTrusted({username: source.userName});
      }
      else
        this.deleteTrusted({username: source.userName});
    },
    changeFollowStatus(source) {
      if (!this.followedIds.includes(source.id))
        this.follow({username: source.userName});
      else
        this.unfollow({username: source.userName});
    },
    changeSort (column) {
     if (this.pagination.sortBy === column) {
       this.pagination.descending = !this.pagination.descending;
     } else {
       this.pagination.sortBy = column;
       this.pagination.descending = false;
     }
    },
    ...mapActions('relatedSources', [
      'fetchFollows',
      'fetchTrusteds',
      'addTrusted',
      'deleteTrusted',
      'follow',
      'unfollow'
    ])
  }
}
</script>
