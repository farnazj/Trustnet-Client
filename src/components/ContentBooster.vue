<template>

  <div class="text-xs-center">
      <v-menu v-model="menu"
        :close-on-content-click="false"
        :nudge-width="350"
        offset-y left attach
      >
        <v-btn flat icon slot="activator" color="light-green darken-3">
          <v-icon>note_add</v-icon>
        </v-btn>

        <v-tabs left color="blue darken-2" dark height=50
          slider-color="lime lighten-4" v-model="tabs">
          <v-tab >
            <v-icon class="mr-1">create</v-icon>
            Create
          </v-tab>

          <v-tab >
            <v-icon class="mr-1">link</v-icon>
            Import
          </v-tab>

          <v-tab-item>
            <v-form ref="createPostForm" lazy-validation>
              <v-card>
                <v-container fluid>

                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field v-model="title"
                        label="Title for your post" required
                        :rules="createPostFormRules.titleRules">
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-flex xs12>
                        <v-textarea v-model="body" label="Post body" rows=8
                        required :rules="createPostFormRules.bodyRules">
                        </v-textarea>
                      </v-flex>
                    </v-flex>
                  </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <!-- <span>Select your target audience or leave this empty to
                      include everyone</span> -->
                    <source-selector ref="initiateTargets" class="mt-2">
                    </source-selector>

                  </v-flex>
                </v-layout>

                <v-divider></v-divider>
                <!-- <v-layout row>
                  <v-flex xs12>

                    <div class="uploaded-media">
                    </div>

                    <v-btn small round color="primary" dark>
                      <v-icon right dark class="pr-1 ml-1">photo_camera</v-icon>
                      Photo/Video
                    </v-btn>

                  </v-flex>
                </v-layout>

               <v-divider></v-divider> -->

              </v-container>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn flat @click="cancel">Cancel</v-btn>
                <v-btn color="primary" flat @click="createPost">
                  <v-icon class="pr-1" >fas fa-rocket</v-icon> Boost
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-form>

          </v-tab-item>

          <v-tab-item>
            <v-form ref="importArticleForm" lazy-validation>
              <v-card>
                <v-container fluid>

                  <v-layout row>
                    <v-flex xs12>
                      <v-textarea v-model="articleLink"
                        label="Import an article by pasting its URL" required
                        :rules="importArticleFormRules.urlRules">
                      </v-textarea>
                    </v-flex>
                  </v-layout>


                  <assessment-collector ref="assessmentColl" :validityRules="importArticleFormRules.validityRules"
                    :postCredibility="postCredibility" :assessmentBody="assessmentBody">
                  </assessment-collector>

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

                  <v-btn flat @click="cancel">Cancel</v-btn>
                  <v-btn color="primary" flat @click="importArticle">
                    <v-icon class="pr-1" >fas fa-rocket</v-icon> Boost
                  </v-btn>
                </v-card-actions>

              </v-card>
            </v-form>

          </v-tab-item>
        </v-tabs>

        <v-alert v-model="alert" type="error" dismissible>
          Something went wrong. Try again later.
        </v-alert>
      </v-menu>


    </div>

</template>

<script>
import sourceSelector from '@/components/SourceSelector'
import assessmentCollector from '@/components/AssessmentCollector'
import postServices from '@/services/postServices'
import { mapActions } from 'vuex'

export default {
  components: {
    'source-selector': sourceSelector,
    'assessment-collector': assessmentCollector
  },
  data () {
    return {
      // valid: true,
      menu: false,
      tabs: null,
      title: '',
      body: '',
      articleLink: '',
      postCredibility: null,
      assessmentBody: '',
      createPostFormRules: {
        titleRules: [
          v => !!v || 'Title is required'
        ],
        bodyRules: [
          v => !!v || 'Body is required'
        ]
      },
      importArticleFormRules: {
        urlRules: [
          v => !!v || 'URL is required'
        ],
        validityRules: [
          v => !!v || 'Assess the accuracy of the article'
        ]
      },
      alert: false

    }
  },
  methods: {
    createPost: function() {
      if (this.$refs.createPostForm.validate()) {
        let params = {
          title: this.title,
          body: this.body,
          target_usernames: this.$refs.initiateTargets.targets
        }
        postServices.initiatePost(params)
        .then(response => {
          if (response.status != 200) {
            this.alert = true;
          }
          else {
            this.menu = false;
            this.applyFilter({
              'filters': {
                'validity': 'All',
                'sources': 'Followed',
                'seen_status':'Not Seen'
              },
              'source_usernames': []
            });
          }

        })
      }

    },
    importArticle: function() {
      if (this.$refs.importArticleForm.validate()) {

        let params = {
          postUrl: this.articleLink,
          postCredibility: this.$refs.assessmentColl.credibility - 1,
          assessmentBody: this.$refs.assessmentColl.assessmentText,
          target_usernames: this.$refs.importTargets.targets
        };

        postServices.importArticle(params)
        .then(response => {
          if (response.status != 200) {
            this.alert = true;
          }
          else {
            this.menu = false;
            this.applyFilter({
              'filters': {
                'validity': 'All',
                'sources': 'Followed',
                'seen_status':'Not Seen'
              },
              'source_usernames': []
            });
          }
        })

      }
      else {
        console.log('invalid')
      }
    },
    cancel: function() {
      for (let form of ['createPostForm', 'importArticleForm'])
        this.$refs[form].reset();
      this.menu = false;
    },
    ...mapActions('articleFilters', [
      'applyFilter'
    ])
  }

}
</script>

<style scoped>

</style>
