<template>

  <v-list class="pt-4 article-filters scrollable" expand dark dense>
    <v-list-item>
      <v-list-item-action>
          <v-icon>filter_list</v-icon>
        </v-list-item-action>
      <v-list-item-subtitle class="bold">
        Filters
      </v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item>
      <v-list-item-action>
        <v-switch dense :color="selectedFilters.explore ? 'blue lighten-1' : ''"
         v-model="selectedFilters.explore" @change="filter(true, 'explore')"
       ></v-switch>
     </v-list-item-action>
     <v-tooltip right>
       <template v-slot:activator="{ on }">

         <v-list-item-subtitle v-on="on" open-delay="700" nudge-width="200"
         v-html="`Explore mode ${selectedFilters.explore ? 'on' : 'off'}`" >
         </v-list-item-subtitle>
       </template>
       <span>By turning the explore mode on, you'll see posts from any source, not
       just those you follow.</span>
     </v-tooltip>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-group prepend-icon="remove_red_eye" value="true">

      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title >View Status</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-group no-action sub-group value="true">
        <template v-slot:activator>
          <v-list-item-content @click="filter('All', 'seenStatus')">
            <v-list-item-title >All</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-for="(status, i) in seenStatusFilters"
          :key="i" @click="filter(status, 'seenStatus')"
          :class="{highlighted:status == selectedFilters['seenStatus']}">
          <v-list-item-content>
            <v-list-item-title v-text="status"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list-group>
    </v-list-group>
    <v-divider></v-divider>

    <v-list-group prepend-icon="gavel" value="true">
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>Validity</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-group no-action sub-group value="true">
        <template v-slot:activator>

          <v-list-item-content slot="activator" @click="filter('All', 'validity')">
            <v-list-item-title>All</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-for="(validity, i) in validityFilters"
          :key="i" @click="filter(validity, 'validity')"
          :class="{highlighted:validity == selectedFilters['validity']}">
          <v-list-item-content>
            <v-list-item-title v-text="validity"></v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list-group>
    </v-list-group>

    <v-divider></v-divider>

    <v-list-group prepend-icon="account_circle" value="true" no-action>
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>Assessor sources</v-list-item-title>
        </v-list-item-content>
      </template>

      <template v-for="(source, i) in sourceFilters">

        <v-list-item v-if="source !== 'Selected Sources' || (sourceLists.length || followedOrTrusteds.length)"
          @click="filter(source, 'sources')" :key="i"
          :class="{highlighted:source == selectedFilters['sources']}">
          <v-list-item-content>
            <v-list-item-title> {{source}} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </template>
    </v-list-group>

    <v-divider></v-divider>

    <v-list subheader v-if="sourceLists.length">
      <v-subheader>Source Lists</v-subheader>

      <v-list-item v-for="list in sourceLists"
          :key="list.id" @click="selectSource(list, false)"
          :class="{highlighted: sourceSelectionMode && selectedLists.includes(list.id)}">

        <v-list-item-action v-if="sourceSelectionMode" class="pa-0 source-checkbox">
          <v-checkbox v-model="selectedListsCheckMark[list.id]"></v-checkbox>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-subtitle>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <span v-on="on">{{list.name}}</span>
              </template>
              <span>{{list.name}}</span>
            </v-tooltip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

    </v-list>

    <v-list subheader v-if="followedOrTrusteds.length">
      <v-subheader>Followed or Trusted Sources</v-subheader>

      <v-list-item v-for="source in followedOrTrusteds"
          :key="source.id" @click="selectSource(source, true)"
          :class="{highlighted: sourceSelectionMode && selectedSources.includes(source.userName)}">

          <v-list-item-action v-if="sourceSelectionMode" class="pa-0 source-checkbox">
            <v-checkbox v-model="selectedSourcesCheckMark[source.userName]"></v-checkbox>
          </v-list-item-action>

        <v-list-item-avatar class="custom-list-avatar mr-1">
          <custom-avatar :user="source" :clickEnabled="false" :size="32"></custom-avatar>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-subtitle>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <span v-on="on">{{sourceDisplayName(source)}}</span>
              </template>
              <span>{{sourceDisplayName(source)}}</span>
            </v-tooltip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </v-list>

</template>

<script>
  import customAvatar from '@/components/CustomAvatar'
  import sourceHelpers from '@/mixins/sourceHelpers'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import consts from '@/services/constants'

  export default {
    components: {
      'custom-avatar': customAvatar
    },
    data: () => {
      return {
        validityFilters: [ 'Confirmed', 'Refuted', 'Debated', 'Questioned'],
        sourceFilters: ['Anyone', 'Followed', 'Me', 'Trusted', 'Selected Sources'],
        seenStatusFilters: ['Not Seen', 'Seen'],
        selectedFilters: {'validity': undefined, 'sources': 'Followed',
          'seenStatus':'Not Seen', 'explore': false },
        selectedSources: [],
        selectedLists: [],
        sourceSelectionMode: false,
        selectedSourcesCheckMark: {},
        selectedListsCheckMark: {}
      }
    },
    created() {
      this.fetchFollows();
      this.fetchTrusteds();
      this.resetSourceCheckbox();
      this.presetFilters();

      if (!this.sourceLists.length)
        this.fetchLists();
    },
    computed: {
      ...mapGetters('articleFilters', [
        'filters'
      ]),
      ...mapState('sourceLists', [
        'sourceLists'
      ]),
      ...mapGetters('relatedSources', [
       'followedOrTrusteds'
     ])
    },
    methods: {

      filter: function(value, type) {

        let prevValue = this.selectedFilters[type];

        if (value == 'All') //validity
          this.selectedFilters[type] = undefined;
        else if (type != 'explore')
          this.selectedFilters[type] = value;

        if (this.selectedFilters['sources'] == 'Selected Sources')
          this.sourceSelectionMode = true;
        else {
          this.sourceSelectionMode = false;

          this.selectedSources = [];
          this.selectedLists = [];
          this.selectedSourcesCheckMark = [];
          this.selectedListsCheckMark = [];

          if (prevValue == 'Selected Sources')
            this.resetSourceCheckbox();

          if (type == 'explore' && this.selectedFilters['explore'] == true)
            this.selectedFilters['sources'] = 'Anyone';
        }

        if (this.selectedFilters[type] != prevValue || type == 'explore') {
          if (value != 'Selected Sources' || this.selectedSources.length ||
          this.selectedLists.length)
            this.filterBoosts();
        }

      },
      selectSource: function(entity, isSource) {

        let uniqueSelector = isSource ? entity.userName : entity.id;
        let selectedEntityList = isSource ? this.selectedSources : this.selectedLists;
        let checkMarkEntity = isSource ? this.selectedSourcesCheckMark : this.selectedListsCheckMark;

        if (this.sourceSelectionMode) {
          if (selectedEntityList.includes(uniqueSelector)) {
            selectedEntityList.splice(selectedEntityList.indexOf(uniqueSelector), 1);
            checkMarkEntity[uniqueSelector] = false;
          }
          else {
            selectedEntityList.push(uniqueSelector);
            checkMarkEntity[uniqueSelector] = true;
          }

          this.filterBoosts();
        }
        else {
          if (isSource)
            this.$router.push({ name: 'profile', params: { username: entity.userName } });
        }

      },
      resetSourceCheckbox: function() {

        this.followedOrTrusteds.forEach(source => {
          this.selectedSourcesCheckMark[source.userName] = false;
        })
      },
      /*
      To highlight in the interface the selections previously set and maintained in store
      */
      presetFilters: function() {

        this.selectedFilters['validity'] = this.filters.validityFilter.split(' ').map((s) =>
          s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

        this.selectedFilters['seenStatus'] = this.filters.seenFilter.split(' ').map((s) =>
          s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

        this.selectedFilters['explore'] = this.filters.exploreFilter;

        if (this.filters.sourceFilter != consts.CRED_SOURCES_REQ_MAPPING['selected sources']) {
          this.selectedFilters['sources'] = this.filters.sourceFilter.split(' ').map((s) =>
            s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

          this.sourceSelectionMode = false;
          this.selectedSources = [];
          this.selectedLists = [];
          this.selectedSourcesCheckMark = [];
          this.selectedListsCheckMark = [];
        }
        else {
          this.selectedFilters['sources'] = 'Selected Sources';
          this.sourceSelectionMode = true;

          /*
          See if the sources have changed since the last time filters were set
          (because some of the previously selected sources might not exist anymore)
          */
          let sourcesChanged = false;

          for (let isSource of [0, 1]) {

            let selectedEntityList = isSource ? this.selectedSources : this.selectedLists;
            let checkMarkEntity = isSource ? this.selectedSourcesCheckMark : this.selectedListsCheckMark;
            let prevSelectedEntities = isSource ? this.filters.filteredUsernames : this.filters.filteredLists;

            let maintainedEntities = isSource ? this.followedOrTrusteds.map(el => el.userName) :
              this.sourceLists.map(el => el.id);

            for (let uniqueSelector of prevSelectedEntities) {

              if (maintainedEntities.includes(uniqueSelector)) {
                if (!selectedEntityList.includes(uniqueSelector)) {
                  selectedEntityList.push(uniqueSelector);
                  checkMarkEntity[uniqueSelector] = true;
                }
              }
              else {
                selectedEntityList.splice(selectedEntityList.indexOf(uniqueSelector), 1);
                checkMarkEntity[uniqueSelector] = false;
                sourcesChanged = true;
              }
            }
          }

          if (sourcesChanged)
            this.filterBoosts();
        }

      },
      filterBoosts: function() {

        this.applyFilter({
          'filters': this.selectedFilters,
          'filteredUsernames': this.selectedSources,
          'filteredLists': this.selectedLists
        });
      },
      ...mapActions('articleFilters', [
        'applyFilter',
      ]),
      ...mapActions('relatedSources', [
        'fetchFollows',
        'fetchTrusteds'
      ]),
      ...mapActions('sourceLists', [
        'fetchLists'
      ])
    },
    watch: {
      filters: function(val) {
        this.presetFilters();
      }
    },
    mixins: [sourceHelpers]

}
</script>

<style scoped>

.article-filters {
  height: calc(100vh - 48px);
  overflow-x: scroll;
  max-width: 17%;
  text-overflow: ellipsis;
  border-radius: 0px;
}
@media all and (max-width: 960px) {
  .article-filters {
    min-width: 100%;
  }
}

.bold {
  font-size: 120%;
}
.highlighted {
  background-color: #64B5F6;
}
.scrollable {
  overflow-y: auto;
}
.source-checkbox {
  min-width: inherit;
}

.custom-list-avatar {
  overflow: initial;
}

</style>
