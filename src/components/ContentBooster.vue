<template>

  <div class="text-xs-center">
      <v-menu v-model="menu"
        :close-on-content-click="false"
        :nudge-width="300"
        offset-y left
      >
        <v-btn flat icon slot="activator" color="red lighten-2">
          <v-icon>create</v-icon>
        </v-btn>

        <v-form v-model="valid">
          <v-card>
            <v-container fluid>

              <v-layout row>
                <v-flex xs12>
                    <v-text-field v-model="title"
                      label="Title for your post" required>
                    </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-flex xs12>
                    <v-textarea v-model="body" label="Post body"
                    required auto-grow>
                    </v-textarea>
                  </v-flex>
                </v-flex>
              </v-layout>

            <v-layout row>
              <v-flex xs12>
                <template>
                  <span>Select your target audience or leave this empty to
                    include everyone</span>
                  <v-autocomplete v-model="targets" :items="getFriends"
                  box chips color="blue-grey lighten-2" label="Select target audience"
                  item-text="userName" item-value="userName" multiple class="mt-2" >

                    <template slot="selection" slot-scope="data" >
                      <v-chip
                        :selected="data.selected" close
                        class="chip--select-multi"
                        @input="remove(data.item)" >
                        <v-avatar>
                          <custom-avatar :user="data.item"></custom-avatar>
                        </v-avatar>
                      {{ sourceDisplayName(data.item) }}
                      </v-chip>
                    </template>

                    <template slot="item" slot-scope="data">

                      <template>
                        <v-list-tile-avatar>
                          <custom-avatar :user="data.item"></custom-avatar>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title v-html="sourceDisplayName(data.item)"></v-list-tile-title>
                        </v-list-tile-content>
                      </template>

                    </template>
                  </v-autocomplete>

                </template>

              </v-flex>
            </v-layout>

            <v-divider></v-divider>
            <v-layout row>
              <v-flex xs12>

                <div class="uploaded-media">
                </div>

                <v-btn small round color="primary" dark>
                  <v-icon right dark class="pr-1 ml-1">photo_camera</v-icon>
                  Photo/Video
                </v-btn>

              </v-flex>
            </v-layout>

            <v-divider></v-divider>

          </v-container>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn flat @click="menu = false">Cancel</v-btn>
            <v-btn color="primary" flat @click="menu = false">
              <v-icon class="pr-1" >fas fa-rocket</v-icon> Boost
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>

      </v-menu>
    </div>


</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import { mapState, mapActions } from 'vuex';
import sourceHelpers from '@/mixins/sourceHelpers'

export default {
  components: {
    'custom-avatar': customAvatar
  },
  data () {
    return {
      valid: false,
      menu: false,
      title: '',
      body: '',
      targets: [],
    }
  },
  created(){
    if (!this.followed_sources.length)
      this.fetchFollows();
  },
  computed: {
    getFriends: function() {
      let friends = this.followed_sources.filter(source => !source.systemMade);
      return friends;

    },
    ...mapState('relatedSources', [
     'followed_sources',
    ])

  },
  methods: {
     remove (item) {
       const index = this.targets.indexOf(item.userName)
       if (index >= 0) this.targets.splice(index, 1)
     },
     ...mapActions('relatedSources', [
       'fetchFollows'
     ])
   },
  mixins : [sourceHelpers]


}
</script>
