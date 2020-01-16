<template>

  <v-fade-transition>
    <v-card outlined @click="showFullList" class="pa-1">
      <v-row no-gutters class="list-header">
        <v-col cols="12">
          <v-row justify="center" no-gutters class="subtitle-1">
            <span v-if="!edit.mode">{{list.name}} </span>
            <span v-else>
              <v-form ref="listNameForm" lazy-validation>
                <v-text-field v-model="edit.listName" class="pt-1" @click.stop=""
                :rules="edit.rules">
                </v-text-field>
              </v-form>
            </span>
          </v-row>
        </v-col>

        <v-col cols="1" class="right-placed">

          <v-tooltip bottom :open-on-hover="true" open-delay="500">
            <template v-slot:activator="{ on }">
              <v-btn text icon x-small v-on="on" @click.stop="handleEdit"
              :color="edit.mode ? 'green darken-1' : 'primary'" :ripple=false>
                <v-icon v-if="!edit.mode">edit</v-icon>
                <v-icon v-else :disabled="!edit.listName.length">check</v-icon>
              </v-btn>
            </template>
            <span v-if="!edit.mode">Edit list name</span>
            <span v-else>Save list name</span>
          </v-tooltip>

        </v-col>

      </v-row>
      <v-divider></v-divider>

      <v-row no-gutters>
        <v-list flat dense min-width="100%">
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item v-for="(source, i) in listSources" :key="i" >
              <v-list-item-avatar>
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
      edit: {
        mode: false,
        listName: '',
        rules: [
          v => !!v || 'Forgot to write the list name?'
        ]
      }
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
    this.edit.listName = this.list.name;
  },
  computed: {
    sourcesCount: function() {
      return this.list.ListEntities.length;
    },
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
      if (this.edit.mode){
        if (this.$refs.listNameForm.validate()) {

          this.updateListName({
            listId: this.list.id,
            listName: this.edit.listName
          })
          .then(() => {
            this.edit.mode = !this.edit.mode;
          })
          .catch(err => {
            this.$emit('errorOccured', { message: err });
          })
        }
      }
      else {
        this.edit.listName = this.list.name;
        this.edit.mode = !this.edit.mode;
      }

    },
    ...mapActions('sourceLists', [
      'updateListName',
      'removeSourceFromList'
    ]),

  },
  watch: {
    list: {
      handler(newVal) {
        this.fetchCardSources();
      },
      deep: true
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
</style>
