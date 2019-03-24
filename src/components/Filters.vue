<template>

  <v-list class="pt-5 article-filters scrollable" expand dark>
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

      <v-list subheader>
        <v-subheader>Followed Sources</v-subheader>
        <v-list-tile v-for="source in followed_sources"
            :key="source.id" avatar @click="selectSource(source)"
            :class="{highlighted:selected_sources.includes(source.userName)}">
          <v-list-tile-avatar>
            <custom-avatar :user="source" :size="36"></custom-avatar>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-sub-title>{{sourceDisplayName(source)}} </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

  </v-list>

</template>

<script>
  import customAvatar from '@/components/CustomAvatar'
  import timeHelpers from '@/mixins/timeHelpers'
  import sourceHelpers from '@/mixins/sourceHelpers'
  import { mapState, mapActions } from 'vuex';

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
      }
    },
    created() {

      this.fetchFollows();
      this.fetchTrusteds();
    },
    computed: {
      ...mapState('relatedSources', [
       'followed_sources',
       'trusted_sources'
     ])

    },
    methods: {
      filter: function(name, type) {

        if (name == 'All')
          this.selected_filters[type] = undefined;
        else
          this.selected_filters[type] = name

        this.filterBoosts();
      },
      selectSource: function(source) {
        if (this.selected_sources.includes(source.userName))
          this.selected_sources.splice(this.selected_sources.indexOf(source.userName), 1);
        else
          this.selected_sources.push(source.userName);

        if (this.selected_filters.sources == 'Selected Sources')
          this.filterBoosts();
      },

      filterBoosts: function() {
        this.applyFilter({'filters': this.selected_filters,
          'source_usernames': this.selected_sources});
      },
      ...mapActions('articleFilters', [
        'applyFilter',
      ]),
      ...mapActions('relatedSources', [
        'fetchFollows',
        'fetchTrusteds'
      ])

    },
    mixins: [sourceHelpers]

}
</script>

<style scoped>

.article-filters {
  height: 97vh;
  -background-color: #EEEEEE;
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
