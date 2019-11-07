<template>

  <div class="text-xs-center">
      <v-menu v-model="menu"
        :close-on-content-click="false"
        :nudge-width="350"
        offset-y left attach
      >
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on" color="light-green darken-3">
          <v-icon>note_add</v-icon>
        </v-btn>
      </template>

        <v-tabs left background-color="blue darken-2" dark height=50
          slider-color="lime lighten-4" v-model="tabs">
          <v-tab >
            <v-icon class="mr-1">create</v-icon>
            Create
          </v-tab>

          <v-tab >
            <v-icon class="mr-1">link</v-icon>
            Import
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <v-form ref="createPostForm" lazy-validation>
              <v-card>
                <v-container fluid>

                  <v-row no-gutters class="my-3">
                    <v-col cols="12">
                      <v-text-field v-model="title"
                        label="Title for your post" required
                        :rules="createPostFormRules.titleRules">
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-textarea v-model="body" label="Post body" rows=8
                      required :rules="createPostFormRules.bodyRules">
                      </v-textarea>
                    </v-col>
                  </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <!-- <span>Select your target audience or leave this empty to
                      include everyone</span> -->
                    <source-selector ref="initiateTargets" class="mt-2">
                    </source-selector>

                  </v-col>
                </v-row>

                <v-divider></v-divider>
                <!-- <v-row>
                  <v-col xs12>

                    <div class="uploaded-media">
                    </div>

                    <v-btn small round color="primary" dark>
                      <v-icon right dark class="pr-1 ml-1">photo_camera</v-icon>
                      Photo/Video
                    </v-btn>

                  </v-col>
                </v-row>

               <v-divider></v-divider> -->

              </v-container>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text @click="cancel">Cancel</v-btn>
                <v-btn color="primary" text @click="createPost">
                  <v-icon class="pr-1" >fas fa-share </v-icon> Share
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-form>

          </v-tab-item>

          <v-tab-item>
            <v-form ref="importArticleForm" lazy-validation>
              <v-card>
                <v-container fluid>

                  <v-row no-gutters class="mb-3">
                    <v-col cols="12">
                      <v-textarea v-model="articleLink"
                        label="Import an article by pasting its URL" required
                        :rules="importArticleFormRules.urlRules">
                      </v-textarea>
                    </v-col>
                  </v-row>

                  <assessment-collector ref="assessmentColl" :validityRules="importArticleFormRules.validityRules"
                    :postCredibility="postCredibility" :assessmentBody="assessmentBody" class="mb-2">
                  </assessment-collector>

                  <v-row no-gutters class="mt-2">
                    <v-col cols="12">
                      <source-selector ref="importTargets" >
                      </source-selector>
                    </v-col>
                  </v-row>

                </v-container>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text @click="cancel">Cancel</v-btn>
                  <v-btn color="primary" text @click="importArticle">
                    <v-icon class="pr-1" >fas fa-share</v-icon> Share
                  </v-btn>
                </v-card-actions>

              </v-card>
            </v-form>

          </v-tab-item>
        </v-tabs-items>

        <v-alert v-model="alert" type="error" dismissible>
          {{alertMessage}}
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
        validityRules: {
          selectRules: [
            v => !!v || 'Assess the accuracy of the article'
          ],
          bodyRules: [
            v => !!v || 'You should add your reasoning'
          ]
        }
      },
      alert: false,
      alertMessage: '',
      createMessage: 'Something went wrong. Try again later.',
      importMessage: 'Something went wrong. Check that the URL is correct and try again later.'
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
            this.alertMessage = this.createMessage;
            this.alert = true;
          }
          else {
            this.menu = false;
            this.applyFilter({
              'filters': {
                'validity': 'All',
                'sources': 'Followed',
                'seenStatus':'Not Seen'
              },
              'sourceUsernames': []
            });
          }

        })
      }

    },
    importArticle: function() {
      if (this.$refs.importArticleForm.validate()) {

        let params = {
          postUrl: this.articleLink,
          postCredibility: this.$refs.assessmentColl.credibility - 2,
          assessmentBody: this.$refs.assessmentColl.assessmentText,
          target_usernames: this.$refs.importTargets.targets
        };

        postServices.importArticle(params)
        .then(response => {
          console.log(response)
          if (response.status != 200) {
            this.alertMessage = this.importMessage;
            this.alert = true;
          }
          else {
            this.menu = false;
            this.applyFilter({
              'filters': {
                'validity': 'All',
                'sources': 'Followed',
                'seenStatus':'Not Seen'
              },
              'sourceUsernames': []
            });
          }
        })
        .catch(err => {
          this.alertMessage = this.importMessage;
          this.alert = true;
        })
      }
      else {
        console.log('invalid')
      }
    },
    cancel: function() {
      console.log(this.$refs)
      for (let form of ['createPostForm', 'importArticleForm']) {
        if (typeof this.$refs[form] !== 'undefined')
          this.$refs[form].reset();
      }
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
