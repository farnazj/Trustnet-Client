<template>

  <v-list class="pt-4 article-filters scrollable sth" expand dark dense >
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
     <v-tooltip right open-delay="700" nudge-width="200">
       <template v-slot:activator="{ on }">

         <v-list-item-subtitle v-on="on"
         v-html="`Explore mode ${selectedFilters.explore ? 'on' : 'off'}`" >
         </v-list-item-subtitle>
       </template>
       <span>By turning the explore mode on, you'll see posts from any source, not
       just those you follow.</span>
     </v-tooltip>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-group prepend-icon="remove_red_eye" value="true" class="sth">

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
          :class="{highlighted:status == selectedFilters['seenStatus']}" :light="status == selectedFilters['seenStatus']">
          <v-list-item-content>
            <v-list-item-title v-text="status"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list-group>
    </v-list-group>
    <v-divider></v-divider>

    <v-list-group prepend-icon="gavel" value="true" class="sth">
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>Accuracy</v-list-item-title>
        </v-list-item-content>
      </template>

      <v-list-group no-action sub-group value="true">
        <template v-slot:activator>

          <v-list-item-content slot="activator" @click="filter('All', 'accuracy')">
            <v-list-item-title>All</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item v-for="(accuracyObj, i) in accuracyFilters"
          :key="i" @click="filter(accuracyObj.serverName, 'accuracy')"
          :class="{highlighted:accuracyObj.serverName == selectedFilters['accuracy']}"
          :light="accuracyObj.serverName == selectedFilters['accuracy']">
          <v-list-item-content>
            <v-list-item-title v-text="accuracyObj.displayedName"></v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list-group>
    </v-list-group>

    <v-divider></v-divider>

    <v-list-group prepend-icon="account_circle" value="true" no-action>
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>Assessors</v-list-item-title>
        </v-list-item-content>
      </template>

      <template v-for="(sourceObj, i) in sourceFilters">

        <v-list-item v-if="sourceObj.displayedName !== 'Selected Sources' || (sourceLists.length || followedOrTrusteds.length)"
          @click="filter(sourceObj.serverName, 'sources')" :key="i"
          :class="{highlighted:selectedFilters['sources'].includes(sourceObj.serverName)}" 
          :light="selectedFilters['sources'].includes(sourceObj.serverName)">

          <v-list-item-action class="pa-0 source-checkbox">
            <v-checkbox v-model="selectedAssessorsCheckMark[sourceObj.serverName]"></v-checkbox>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title> {{sourceObj.displayedName}} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </template>
    </v-list-group>

    <v-divider></v-divider>

    <v-list dense subheader v-if="sourceLists.length">
      <v-subheader>Source Lists</v-subheader>

      <v-list-item v-for="list in sourceLists"
          :key="list.id" @click="selectSource(list, false)"
          :class="{highlighted: sourceSelectionMode && selectedLists.includes(list.id)}"
          :light="sourceSelectionMode && selectedLists.includes(list.id)">

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

    <v-list dense subheader v-if="followedOrTrusteds.length">
      <v-subheader>Followed or Trusted Sources</v-subheader>

      <v-list-item v-for="source in followedOrTrusteds"
          :key="source.id" @click="selectSource(source, true)"
          :class="{highlighted: sourceSelectionMode && selectedSources.includes(source.userName)}"
          :light="sourceSelectionMode && selectedSources.includes(source.userName)">

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
        accuracyFilters: [
          {
            serverName: 'confirmed',
            displayedName: 'Confirmed'
          }, {
            serverName: 'refuted',
            displayedName: 'Refuted'
          }, {
            serverName: 'debated',
            displayedName: 'Split Opinion'
          }, {
            serverName: 'questioned',
            displayedName: 'Questioned'
          }
        ],
        sourceFilters: [
           {
            serverName: 'followed',
            displayedName: 'Followed'
          }, {
            serverName: 'me',
            displayedName: 'Me'
          }, {
            serverName: 'trusted',
            displayedName: 'Trusted'
          }, {
            serverName: 'specified',
            displayedName: 'Selected Sources'
          }
        ],
        seenStatusFilters: ['Not Seen', 'Seen'],
        selectedFilters: {'accuracy': undefined, 'sources': ['Followed'],
          'seenStatus':'Not Seen', 'explore': false },
        selectedAssessorsCheckMark: {}, 
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

        let prevValue = Array.isArray(this.selectedFilters[type]) ? 
          this.selectedFilters[type].slice(0) : this.selectedFilters[type];

        if (value == 'All') //accuracy
          this.selectedFilters[type] = undefined;
        else if (type != 'explore') {
          if (type == 'sources') {

            if (this.selectedFilters[type].includes(value)) {
              this.selectedFilters[type].splice(this.selectedFilters[type].indexOf(value), 1);
            }
            else {
              this.selectedFilters[type].push(value);
            }

            this.selectedAssessorsCheckMark[value] = !this.selectedAssessorsCheckMark[value]; //toggle assessor checkmark
          }
          else {
            this.selectedFilters[type] = value;
          }
        }


        if (this.selectedFilters['sources'].includes('Selected Sources'))
          this.sourceSelectionMode = true;
        else if (Array.isArray(prevValue) && prevValue.includes('Selected Sources')) {
          
          this.sourceSelectionMode = false;

          this.selectedSources = [];
          this.selectedLists = [];
          this.selectedSourcesCheckMark = [];
          this.selectedListsCheckMark = [];

          if (prevValue.includes('Selected Sources'))
            this.resetSourceCheckbox();

          if (type == 'explore' && this.selectedFilters['explore'] == true)
            this.selectedFilters['sources'] = ['Followed', 'Trusted', 'Me'];
        }

        /*
        filter if the new value is not the same as the old value or if the new array (for assessors) has a length that's
        different from before or if the explore mode has been manipulated (has been switched on or off)
        if the type of filter that's been manipulated is assessors -> selected sources, filter only if there are some
        changes to the selected sources and lists or if the selected sources has been unchecked
        */
        if (this.selectedFilters[type] != prevValue || 
            (Array.isArray(this.selectedFilters[type]) && this.selectedFilters[type].length != prevValue.length) || 
            type == 'explore') {

          if (value != 'Selected Sources' || ( value == 'Selected Sources' && (this.selectedSources.length ||
            this.selectedLists.length || this.selectedFilters[type].length < prevValue.length ))) {
             this.filterBoosts();
            }
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

        this.selectedFilters['accuracy'] = this.filters.accuracyFilter;//.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

        this.selectedFilters['seenStatus'] = this.filters.seenFilter.split(' ').map((s) =>
          s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

        this.selectedFilters['explore'] = this.filters.exploreFilter;

        this.selectedFilters['sources'] = this.filters.sourceFilters;

        //aligning the checkboxes of assessors with whether they are selected
        for (let assessor of this.sourceFilters.map(el => el.serverName)) {
          if (this.selectedFilters['sources'].includes(assessor))
            this.selectedAssessorsCheckMark[assessor] = true;
          else
            this.selectedAssessorsCheckMark[assessor] = false;
        }

        if (!this.filters.sourceFilters.includes('specified')) {
          this.sourceSelectionMode = false;
          this.selectedSources = [];
          this.selectedLists = [];
          this.selectedSourcesCheckMark = [];
          this.selectedListsCheckMark = [];
        }
        else {
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
  text-overflow: ellipsis;
  border-radius: 0px;
  max-width: 20vw;
}
@media all and (max-width: 1264px) {
  .article-filters {
    max-width: 25vw;
  }
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
  background-color:#E6EE9C;
}
.scrollable {
  overflow-y: auto;
}
.source-checkbox {
  min-width: inherit;
  margin-right: 0.5em !important;
}

.custom-list-avatar {
  overflow: initial;
}

</style>
