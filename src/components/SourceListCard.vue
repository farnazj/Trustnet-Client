<template>

  <v-fade-transition>
    <v-card outlined @click="" class="pa-1">
      <v-row no-gutters justify="center" class="list-header">
        <div class="subtitle-1">{{list.name}}</div>
      </v-row>
      <v-divider></v-divider>

      <v-row no-gutters>
        <v-list flat dense min-width="100%">
          <v-list-item-group v-model="item" color="primary">
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

export default {
  components: {
    'custom-avatar': customAvatar
  },
  data: () => {
    return {
      listSources: [],
      item: null
    }
  },
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  created() {
    this.fetchCardPreviewSources();
  },
  methods: {
    fetchCardPreviewSources: function() {
      sourceListServices.getListSources({
        listId: this.list.id,
        limit: 3,
        offset: 0
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
    getListlength: function() {

    },
    removeSource: function(source) {
      this.$emit('removeSource',
      {
        listId: this.list.id,
        source: source
      })
    }

  },
  watch: {
    list: function(newVal) {
      this.fetchCardPreviewSources();
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
</style>
