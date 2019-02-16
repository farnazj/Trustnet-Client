<template>

  <v-list class="pt-5 full-height scrollable" expand>
    <v-list-tile>
      <v-list-tile-action>
          <v-icon>filter_list</v-icon>
        </v-list-tile-action>
      <v-list-tile-sub-title class="bold">Filters</v-list-tile-sub-title>
    </v-list-tile>

    <v-list-group prepend-icon="gavel" value="true">
      <v-list-tile slot="activator">
        <v-list-tile-title>Validity</v-list-tile-title>
      </v-list-tile>

      <v-list-group no-action sub-group value="true">
        <v-list-tile slot="activator" @click="filter('All', 'validity')">
          <v-list-tile-title>All</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-for="(validity, i) in validity_filters"
          :key="i" @click="filter(validity, 'validity')"
          :class="{highlighted:validity == selected_filters['validity']}">
          <v-list-tile-title v-text="validity"></v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list-group>

    <v-list-group prepend-icon="account_circle" value="true">
      <v-list-tile slot="activator">
        <v-list-tile-title>Sources</v-list-tile-title>
      </v-list-tile>

      <v-list-group sub-group no-action>
        <v-list-tile slot="activator" @click="filter('All', 'sources')">
          <v-list-tile-title>All</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-for="(source, i) in source_filters"
          :key="i" @click="filter(source, 'sources')"
          :class="{highlighted:source == selected_filters['sources']}">
          <v-list-tile-title v-text="source"></v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list-group>


    <v-divider></v-divider>

    <div>
      <v-list subheader>
        <v-subheader>Followed Sources</v-subheader>
        <v-list-tile v-for="source in followed_sources"
            :key="source.id" avatar @click="">
          <v-list-tile-avatar>
            <custom-avatar v-bind:user="source" v-bind:size="38"></custom-avatar>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-sub-title>{{sourceDisplayName(source)}} </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>

  </v-list>

</template>

<script>
  import relationServices from '../../services/relationServices'
  import customAvatar from '../components/CustomAvatar'
  import utils from '../mixins/utils'
  import timeHelpers from '../mixins/timeHelpers'

  export default {
    components: {
      'custom-avatar': customAvatar
    },
    data: () => {
      return {
        validity_filters: [ 'Confirmed', 'Refuted', 'Debated'],
        source_filters: ['Me', 'Trusted', 'Selected Sources'],
        selected_filters: {'validity': undefined, 'sources': undefined },
        selected_sources: [],
        followed_sources: []
      }
    },
    created() {
      relationServices.getFollows()
      .then(response => {
        let follows = response.data;
        follows.sort(this.compareSources);
        this.followed_sources = follows;
      })

    },
    methods: {
      filter: function(name, type) {

        if (name == 'All')
          this.selected_filters[type] = undefined;
        else
          this.selected_filters[type] = name

        this.$store.dispatch('articleFilters/applyFilter',
          {'filters': this.selected_filters, 'source_usernames': this.selected_sources});
      },
      sourceDisplayName: function(source) {
          return source.systemMade ? source.userName : source.firstName + ' ' + source.lastName;
      }
    },
    mixins: [utils]

}
</script>

<style scoped>

.full-height {
  height: 95vh;
}
.bold {
  font-size: 120%;
}

.highlighted {
  background-color: #90CAF9;
}

.scrollable {
  overflow-y: auto;
}

</style>
