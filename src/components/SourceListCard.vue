<template>

  <v-fade-transition>
    <v-card outlined @click="showFullList" class="pa-1">
      <v-row no-gutters class="list-header">
        <v-col cols="12">
          <v-row justify="center" no-gutters class="subtitle-1">
            <span v-if="!editMode">{{list.name}} </span>
            <span v-else>
              <v-form ref="listNameForm" lazy-validation>
                <v-text-field v-model="editListName" class="pt-1" @click.stop=""
                :rules="rules">
                </v-text-field>
              </v-form>
            </span>
          </v-row>
        </v-col>

        <v-col cols="1" class="right-placed">

          <v-tooltip bottom :open-on-hover="true" open-delay="500">
            <template v-slot:activator="{ on }">
              <v-btn text icon x-small v-on="on" @click.stop="handleEdit"
              :color="editMode ? 'green darken-1' : 'primary'" :ripple=false>
                <v-icon v-if="!editMode">edit</v-icon>
                <v-icon v-else :disabled="saveDisabled">check</v-icon>
              </v-btn>
            </template>
            <span v-if="!editMode">Edit list name</span>
            <span v-else>Save list name</span>
          </v-tooltip>

        </v-col>

      </v-row>
      <v-divider></v-divider>

      <v-row no-gutters>
        <v-list flat dense min-width="100%">
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item v-for="(source, i) in listSources" :key="i" >
              <v-list-item-avatar class="custom-list-avatar">
                <custom-avatar :user="source" :clickEnabled="false" :size="36"></custom-avatar>
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

              <v-list-item-action>
                <v-tooltip bottom :open-on-hover="true" open-delay="500">
                  <template v-slot:activator="{ on }">
                    <v-btn x-small outlined @click.stop="removeSource(source)" v-on="on"
                      color="red lighten-1">
                      <v-icon class="xs-icon-font">delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove from list</span>
                </v-tooltip>
              </v-list-item-action>

            </v-list-item>
          </v-list-item-group>
          <v-list-item v-if="isPreview && sourcesCount > previewedSourcesCount"
            class="caption font-weight-light">
            + {{sourcesCount - previewedSourcesCount}} more
          </v-list-item>
        </v-list>
      </v-row>

      <v-row justify="end">
        <v-card-actions>
          <v-btn small text color="red darken-1" @click.stop="deleteList"
          >Delete List</v-btn>
        </v-card-actions>
      </v-row>
    </v-card>
  </v-fade-transition>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import sourceListServices from '@/services/sourceListServices'
import sourceHelpers from '@/mixins/sourceHelpers'
import { mapActions } from 'vuex'

export default {
  components: {
    'custom-avatar': customAvatar
  },
  data: () => {
    return {
      listSources: [],
      selectedItem: null,
      previewedSourcesCount: 3,
      editMode: false,
      editListName: '',
      saveDisabled: false
    }
  },
  props: {
    isPreview: {
      type: Boolean,
      required: true
    },
    list: {
      type: Object,
      required: true
    }
  },
  created() {
    this.fetchCardSources();
    this.editListName = this.list.name;
  },
  computed: {
    sourcesCount: function() {
      return this.list.ListEntities.length;
    },
    rules: function() {
      const rules = [];
      rules.push(v => !!v || 'Forgot to write the list name?');
      rules.push(v => v.indexOf('^,') === -1 || 'List name cannot contain ^,');

      return rules;
    }
  },
  methods: {
    fetchCardSources: function() {

      let paginationReq = this.isPreview ?
      {
        limit: this.previewedSourcesCount,
        offset: 0
      } : {};

      sourceListServices.getListSources({
        listId: this.list.id,
        ...paginationReq
      })
      .then(response => {
        this.listSources = response.data;
      })
      .catch(err => {
        console.log(err);
      })
    },
    deleteList: function() {
      this.$emit('delete', this.list.id);
    },
    removeSource: function(source) {

      this.removeSourceFromList({
        listId: this.list.id,
        source: source
      })
      .catch(err => {
        this.$emit('errorOccured', { message: err });
      })

      this.$emit('removeSource',
      {
        listId: this.list.id,
        source: source
      })
    },
    showFullList: function() {
      if (this.isPreview)
        this.$emit('showList', this.list);
    },
    handleEdit: function() {
      if (this.editMode){
        if (this.$refs.listNameForm.validate()) {

          this.updateListName({
            listId: this.list.id,
            listName: this.editListName
          })
          .then(() => {
            this.editMode = !this.editMode;
          })
          .catch(err => {
            this.$emit('errorOccured', { message: err });
          })
        }
      }
      else {
        this.editListName = this.list.name;
        this.editMode = !this.editMode;
      }
    },
    validateListName: function() {

      if (this.$refs.listNameForm) {
        if (this.$refs.listNameForm.validate())
          this.saveDisabled = false;
        else
          this.saveDisabled = true;
      }
    },
    ...mapActions('sourceLists', [
      'updateListName',
      'removeSourceFromList'
    ])

  },
  watch: {
    list: {
      handler(newVal) {
        this.fetchCardSources();
      },
      deep: true
    },
    editListName: function(){
      this.validateListName();
    }
  },
  mixins: [sourceHelpers]
}
</script>

<style scoped>
.list-header {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-placed {
  position: absolute;
  right: 0px;
}
.custom-list-avatar {
  overflow: initial;
}
</style>
