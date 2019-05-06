<template>

  <v-list class="pt-5 article-filters scrollable" expand dark>
    <v-list-tile>
      <v-list-tile-action>
          <v-icon>filter_list</v-icon>
        </v-list-tile-action>
      <v-list-tile-sub-title class="bold">Filters</v-list-tile-sub-title>
    </v-list-tile>

    <v-list-group prepend-icon="remove_red_eye" value="true">
      <v-list-tile slot="activator">
        <v-list-tile-title>View Status</v-list-tile-title>
      </v-list-tile>

      <v-list-group no-action sub-group value="true">
        <v-list-tile slot="activator" @click="filter('All', 'seen_status')">
          <v-list-tile-title>All</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-for="(status, i) in seen_status_filters"
          :key="i" @click="filter(status, 'seen_status')"
          :class="{highlighted:status == selected_filters['seen_status']}">
          <v-list-tile-title v-text="status"></v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list-group>

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

    <v-list-group prepend-icon="account_circle" value="true" no-action>
      <template slot="activator">
        <v-list-tile >
          <v-list-tile-content>
            <v-list-tile-title>Sources</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>

      <v-list-tile v-for="(source, i) in source_filters"
        :key="i" @click="filter(source, 'sources')"
        :class="{highlighted:source == selected_filters['sources']}">
        <v-list-tile-content>
          <v-list-tile-title> {{source}}</v-list-tile-title>
        </v-list-tile-content>

      </v-list-tile>
    </v-list-group>

    <v-divider></v-divider>

      <v-list subheader>
        <v-subheader>Followed or Trusted Sources</v-subheader>
        <v-list-tile v-for="source in followedOrTrusteds"
            :key="source.id" avatar @click="selectSource(source)"
            :class="{highlighted: sourceSelectionMode && selected_sources.includes(source.userName)}">
          <v-list-tile-avatar>
            <custom-avatar :user="source" :clickEnabled="false" :size="36"></custom-avatar>
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
  import sourceHelpers from '@/mixins/sourceHelpers'
  import { mapGetters, mapActions } from 'vuex';

  export default {
    components: {
      'custom-avatar': customAvatar
    },
    data: () => {
      return {
        validity_filters: [ 'Confirmed', 'Refuted', 'Debated', 'Questioned'],
        source_filters: ['Followed', 'Me', 'Trusted', 'Selected Sources'],
        seen_status_filters: ['Not Seen', 'Seen'],
        selected_filters: {'validity': undefined, 'sources': 'Followed', 'seen_status':'Not Seen' },
        selected_sources: [],
        sourceSelectionMode: false
      }
    },
    created() {
      this.fetchFollows();
      this.fetchTrusteds();
    },
    computed: {
      ...mapGetters('relatedSources', [
       'followedOrTrusteds'
     ])

    },
    methods: {
      filter: function(name, type) {

        let prev_value = this.selected_filters[type];

        if (name == 'All')
          this.selected_filters[type] = undefined;
        else
          this.selected_filters[type] = name;


        if (this.selected_filters['sources'] == "Selected Sources")
          this.sourceSelectionMode = true;
        else {
          this.sourceSelectionMode = false;

          if (this.selected_sources.length)
            this.selected_sources = [];
        }

        if (this.selected_filters[type] != prev_value) {
          if (name != 'Selected Sources' || this.selected_sources.length > 0 )
            this.filterBoosts();
        }

      },
      selectSource: function(source) {
        if (this.sourceSelectionMode) {
          if (this.selected_sources.includes(source.userName))
            this.selected_sources.splice(this.selected_sources.indexOf(source.userName), 1);
          else
            this.selected_sources.push(source.userName);

          this.filterBoosts();
        }
        else {
          this.$router.push({ name: 'profile', params: { username: source.userName } });
        }

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
