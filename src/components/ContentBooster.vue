<!--
 @fileoverview A component that is used for creating a post or imorting an article from another website
-->
<template>

  <div class="text-xs-center">
      <v-menu v-model="menu"
        :close-on-content-click="false"
        :max-width="contentBoosterWidth"
        :min-width="contentBoosterWidth"
        offset-y :left="!$vuetify.breakpoint.xsOnly" 
        :nudge-left="$vuetify.breakpoint.xsOnly ? 130 : 0" 
        attach  max-height="85vh"
      >
      <template v-slot:activator="{ on }">
        <v-btn text icon v-on="on" color="light-green darken-3">
          <v-icon>note_add</v-icon>
        </v-btn>
      </template>

        <v-tabs left background-color="blue darken-2" dark height=34
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
              <v-card class="content-booster-menu">
                <v-container fluid>

                  <v-row no-gutters class="mt-2 mb-3">
                    <v-col cols="12">
                      <v-text-field v-model="title"
                       required :rules="createPostFormRules.titleRules">
                        <template v-slot:label>
                          <span class="subtitle-2">
                            Title for your post
                          </span>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-textarea v-model="body" rows=5 dense auto-grow
                      required :rules="createPostFormRules.bodyRules">
                        <template v-slot:label>
                          <span class="subtitle-2">
                            Post body
                          </span>
                        </template>
                      </v-textarea>
                    </v-col>
                  </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <!-- <span>Select your target audience or leave this empty to
                      include everyone</span> -->
                    <source-selector ref="initiateTargets" class ="mt-2" population="downstream">
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

                <v-btn text @click="cancel" small>Cancel</v-btn>
                <v-btn color="primary" text @click="createPost" small>
                  <v-icon class="pr-1" small>fas fa-share </v-icon> Share
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-form>

          </v-tab-item>

          <v-tab-item>
           
            <validation-observer ref="importArticleObserver" v-slot="{ invalid }">
            <!-- <v-form ref="importArticleForm" lazy-validation> -->
              <v-form>
                <v-card>
                  <v-container fluid>

                    <v-row no-gutters class="mt-2 mb-3">
                      <v-col cols="12">
                          <validation-provider rules="articleUrl" v-slot="{ errors }" >

                            <v-textarea v-model="articleLink" rows=3 dense auto-grow>
                              <template v-slot:label>
                                <span class="subtitle-2">
                                  Import an article by pasting its URL
                                </span>
                              </template>
                            </v-textarea>
                          <span class="caption red--text red--darken-3">{{ errors[0] }}</span>
                          </validation-provider>
                      </v-col>
                    </v-row>

                    <assessment-collector ref="assessmentColl" :postCredibility="postCredibility" 
                      :assessmentBody="assessmentBody" class="mb-2">
                    </assessment-collector>

                    <v-row no-gutters class="mt-2">
                      <v-col cols="12">
                        <source-selector ref="importTargets" population="downstream">
                        </source-selector>
                      </v-col>
                    </v-row>

                  </v-container>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text @click="cancel" small>Cancel</v-btn>
                    <v-btn color="primary" text @click="importArticle" :disabled="invalid || tempDisabled" small>
                      <v-icon class="pr-1" small>fas fa-share</v-icon> Share
                    </v-btn>
                  </v-card-actions>

                </v-card>
            </v-form>
            </validation-observer>

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
import { mapGetters, mapActions } from 'vuex'
import consts from '@/services/constants'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  components: {
    'source-selector': sourceSelector,
    'assessment-collector': assessmentCollector,
    ValidationObserver,
    ValidationProvider
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
        ]
      },
      alert: false,
      alertMessage: '',
      createMessage: 'Something went wrong. Try again later.',
      importMessage: 'Something went wrong. Check that the URL is correct and try again later.',
      tempDisabled: false
    }
  },
  computed: {
    ...mapGetters('articleFilters', [
      'filters'
    ]),
    contentBoosterWidth: function() {
      if (this.$vuetify.breakpoint.xsOnly)
        return '86vw';
      else if (this.$vuetify.breakpoint.smOnly)
        return '50vw';
      else if (this.$vuetify.breakpoint.mdOnly)
        return '40vw';
      else
        return '25vw';
    }
  },
  methods: {

    getSelectedUsernamesAndLists: function() {

      let lists = this.$refs.initiateTargets.targets.filter(el =>
        el.type === 'List').map(el => el.identifier);
      let usernames = this.$refs.initiateTargets.targets.filter(el =>
        el.type === 'Source').map(el => el.identifier);

      return { usernames, lists };
    },
    createPost: function() {

      if (this.$refs.createPostForm.validate()) {

        let targets = this.getSelectedUsernamesAndLists();
        let params = {
          title: this.title,
          body: this.body,
          target_usernames: targets.usernames,
          target_lists: targets.lists
        };

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
                'accuracy': 'All',
                'sources': this.filters.sourceFilters.includes('followed') ?
                  this.filters.sourceFilters : this.filters.sourceFilters.concat('followed'),
                'seenStatus': 'Not Seen',
                'explore': this.filters.exploreFilter
              },
              'filteredUsernames': [],
              'filteredLists': []
            });
          }

        })
      }

    },
    importArticle: function() {
      //if (this.$refs.importArticleForm.validate()) {
      if (this.$refs.importArticleObserver.validate()) {

        let targets = this.getSelectedUsernamesAndLists();

        let params = {
          postUrl: this.articleLink,
          postCredibility: this.$refs.assessmentColl.credibility - 2,
          assessmentBody: this.$refs.assessmentColl.assessmentText,
          target_usernames: targets.usernames,
          target_lists: targets.lists
        };

        if (params.postCredibility == consts.ACCURACY_CODES.QUESTIONED) {
          let arbiters = this.$refs.assessmentColl.$refs.arbiters.targets;
          params.arbiters = arbiters.map(el => el.identifier);
          params.sourceIsAnonymous = this.$refs.assessmentColl.anonymous;
        }

        this.tempDisabled = true;

        postServices.importArticle(params)
        .then(response => {
          if (response.status != 200) {
            this.alertMessage = this.importMessage;
            this.alert = true;
          }
          else {
            this.menu = false;
            this.applyFilter({
              'filters': {
                'accuracy': 'All',
                'sources': this.filters.sourceFilters.includes('followed') ?
                  this.filters.sourceFilters : this.filters.sourceFilters.concat('followed'),
                'seenStatus':'Not Seen',
                'explore': this.filters.exploreFilter
              },
              'filteredUsernames': [],
              'filteredLists': []
            });
          }
        })
        .catch(err => {
          this.alertMessage = this.importMessage;
          this.alert = true;
        })
        .finally( () => {
          this.tempDisabled = false;
        })
      }
      else {
        console.log('invalid')
      }
    },
    cancel: function() {

      for (let reference of ['createPostForm', 'importArticleObserver']) {
        if (typeof this.$refs[reference] !== 'undefined')
          this.$refs[reference].reset();
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

.content-booster-menu {
  overflow-y: auto;
}

</style>
