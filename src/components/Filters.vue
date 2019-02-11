<template>

  <v-list class="pt-5 full-height" expand>
    <v-list-tile>
      <v-list-tile-action>
          <v-icon>filter_list</v-icon>
        </v-list-tile-action>
      <v-list-tile-title class="bold">Filters</v-list-tile-title>
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
</v-list>

</template>

<script>

  export default {

    data: () => {
      return {
        validity_filters: [ 'Confirmed', 'Refuted', 'Debated'],
        source_filters: ['Me', 'Trusted', 'Selected Sources'],
        selected_filters: {'validity': undefined, 'sources': undefined },
        selected_sources: []
      }
  },
  created() {

  },
  computed : {

  },
  methods: {
    filter: function(name, type) {

      if (name == 'All')
        this.selected_filters[type] = undefined;
      else
        this.selected_filters[type] = name

    this.$store.dispatch('articleFilters/applyFilter',
    {'filters': this.selected_filters, 'source_usernames': this.selected_sources});
    }
  }

}
</script>

<style scoped>

.full-height {
  height: 95vh;
}
.bold {
  font-size: 130%;
}

.highlighted {
  background-color: #90CAF9;
}

</style>
