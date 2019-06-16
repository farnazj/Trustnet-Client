<template>
  <v-container fluid class="pt-4 px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row v-if="$vuetify.breakpoint.smAndDown" justify-center class="pt-5">
      <v-flex xs8 >
        <v-dialog v-model="fullScreenFilterVisible" scrollable persistent>
          <template v-slot:activator="{ on }">
            <v-btn outlined block color="secondary" @click="fullScreenFilterVisible = true">
              <v-icon>filter_list</v-icon>
            Filters</v-btn>
          </template>
          <v-card dark>
            <filters></filters>

            <v-divider></v-divider>
            <v-card-actions>
              <v-layout row justify-space-around>
                <v-btn color="blue darken-1" text @click="fullScreenFilterVisible = false">Close</v-btn>
                <v-btn color="blue darken-1" text @click="fullScreenFilterVisible = false">Done</v-btn>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-flex>
    </v-layout>


    <v-layout row>
      <loading></loading>
      <boosters-list detailsNamespace="homeArticleDetails"></boosters-list>
      <assessment-history namespace="homeAssessments"></assessment-history>

      <v-flex xs3 md2 v-show="filtersVisible">
        <filters class="frozen"></filters>
      </v-flex>

      <div v-show="filtersHidden" @click="hideAssessments" class="mt-5 grippy-container frozen">
        <v-layout row justify-center align-center fill-height>
          <span class="grippy">.. .. .. ..</span>
        </v-layout>
      </div>

      <v-flex :xs7="!$vuetify.breakpoint.smAndDown" :offset-xs1="filtersHidden" :xs8="$vuetify.breakpoint.smAndDown"
       :class="{'ml-4':filtersHidden}" >
        <article-holder detailsNamespace="homeArticleDetails" filtersNamespace="articleFilters"
          assessmentsNamespace="homeAssessments" :class="{'pt-5': !$vuetify.breakpoint.smAndDown}">
       </article-holder>
      </v-flex>

      <v-flex>
        <assessments-container namespace="homeAssessments" class="frozen">
        </assessments-container>
      </v-flex>

    </v-layout>

    <article-details detailsNamespace="homeArticleDetails"
     filtersNamespace="articleFilters"> </article-details>

  </v-container>
</template>

<script>
import CustomToolbar from '@/components/CustomToolbar'
import ArticleHolder from '@/components/ArticleHolder'
import ArticleDetails from '@/components/ArticleDetails'
import AssessmentsContainer from '@/components/AssessmentsContainer'
import boostersList from '@/components/BoostersList'
import assessmentHistory from '@/components/AssessmentHistory'
import Filters from '@/components/Filters'
import Loading from '@/components/Loading'
import postServices from '@/services/postServices'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'article-holder': ArticleHolder,
    'article-details': ArticleDetails,
    'assessments-container': AssessmentsContainer,
    'boosters-list': boostersList,
    'assessment-history': assessmentHistory,
    'filters': Filters,
    'loading': Loading
  },
  props: ['postid'],
  data () {
    return {
      fullScreenFilterVisible: false
    }
  },
  computed: {
    filtersVisible: function() {
      if (this.$vuetify.breakpoint.smAndDown)
        return false;
      return !this.visible;
    },
    filtersHidden: function() { //filter bar exists but is hidden because assessments is open
      return !this.$vuetify.breakpoint.smAndDown && this.visible;
    },
    ...mapState('homeAssessments', [
     'visible'
   ])
 },
 beforeRouteLeave (to, from, next) {
   this.hideContainer();
   next();
 },
 created() {
   if (this.postid)
    this.showArticleDetails();
 },
 methods: {
   /*this function is for the path /test/:postid which directs to the same
   component as home*/
   showArticleDetails: function() {
     postServices.getPost({postId: this.postid})
     .then((res) => {
       this.showArticleDrawer(res.data);
     })
   },
   hideAssessments: function() {
     this.hideContainer();
   },
   ...mapActions('homeAssessments', [
     'hideContainer'
   ]),
   ...mapActions('homeArticleDetails', [
     'showArticleDrawer'
   ])
 }
}
</script>


<style scoped>
.frozen {
  position: fixed;
}
.grippy-container {
  background-color: #424242;
  height: 14vh;
  width: calc(1% + 0.3em);
  border-radius: 0 80% 80% 0;
  cursor: pointer;
}
span.grippy {
  min-height: 30%;
  min-width: 50%;
  text-align: center;
  display: inline-block;
  overflow: hidden;
  line-height: 1vh;
  vertical-align: middle;
  font-size: calc(1vh + 0.7em);
  font-family: sans-serif;
  letter-spacing: 2px;
  color: #BDBDBD;
  text-shadow: 1px 0 1px black;
}

</style>
