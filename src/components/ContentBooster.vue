<template>

  <div class="text-xs-center">
      <v-menu v-model="menu"
        :close-on-content-click="false"
        :nudge-width="350"
        offset-y left attach
      >
        <v-btn flat icon slot="activator"  color="red lighten-2">
          <v-icon>create</v-icon>
        </v-btn>

        <v-tabs left color="blue darken-1" dark icons-and-text height=50
          slider-color="amber lighten-1" v-model="tabs">
          <v-tab >
            Create
          </v-tab>

          <v-tab >
            Import
          </v-tab>

          <v-tab-item>
            <v-form >
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
                    <span>Select your target audience or leave this empty to
                      include everyone</span>
                    <source-selector ref="initiateTargets" class="mt-2">
                    </source-selector>

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

          </v-tab-item>

          <v-tab-item>
            <v-form >
              <v-card>
                <v-container fluid>

                  <v-layout row>
                    <v-flex xs12>
                      <v-textarea v-model="article_link"
                        label="Import an article by pasting its URL" required>
                      </v-textarea>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-select :items="validity_status"
                        item-text="label" item-value="value"
                        label="Article Validity" outline required>

                        <template slot="item" slot-scope="data" >
                          <div v-html="data.item.label" :class="data.item.color">
                          </div>
                        </template>

                        <template slot="selection" slot-scope="data" >
                          <div v-html="data.item.label" :class="data.item.color">
                          </div>
                        </template>

                      </v-select>

                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-textarea v-model="assessment_body"
                        label="Provide your reasoning(?)">
                      </v-textarea>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <span>Select your target audience or leave this empty to
                        include everyone</span>
                      <source-selector ref="importTargets" class="mt-2">
                      </source-selector>
                    </v-flex>
                  </v-layout>

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

          </v-tab-item>
        </v-tabs>

      </v-menu>
    </div>

</template>

<script>
import sourceSelector from '@/components/SourceSelector'

export default {
  components: {
    'source-selector': sourceSelector
  },
  data () {
    return {
      valid: false,
      menu: false,
      tabs: null,
      title: '',
      body: '',
      article_link: '',
      validity_status : [
        {
          label: 'This article is accurate',
          value: 2,
          color: 'green--text text--darken-2'
        },
        {
          label: 'This article is inaccurate',
          value: 0,
          color: 'red--text text--accent-3'
        },
        {
          label: 'I want to know about the validity of this article',
          value: 1,
          color: 'amber--text text--darken-3'
        }
      ],
      assessment_body: ''
    }
  },
  created(){

  },
  computed: {

  },
  methods: {

  }

}
</script>

<style scoped>

</style>
