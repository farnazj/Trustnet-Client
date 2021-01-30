<template>
  <v-container fluid class="pt-12 px-0">
    <custom-toolbar></custom-toolbar>

    <v-row no-gutters v-if="$vuetify.breakpoint.smAndDown" justify="center" class="pt-5">
      <v-col cols="8" >
        <v-dialog v-model="fullScreenFilterVisible" scrollable persistent>
          <template v-slot:activator="{ on }">
            <v-btn outlined block color="secondary" @click="fullScreenFilterVisible = true">
              <v-icon>filter_list</v-icon>
              Filters
            </v-btn>
          </template>

          <v-card dark>
            <filters></filters>

            <v-divider></v-divider>
            <v-card-actions>
              <v-row justify="space-around">
                <v-btn color="blue darken-1" text @click="fullScreenFilterVisible = false">Close</v-btn>
                <v-btn color="blue darken-1" text @click="fullScreenFilterVisible = false">Done</v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <loading></loading>
      <boosters-list detailsNamespace="homeArticleDetails" filtersNamespace="articleFilters"></boosters-list>
      <custom-titles titlesNamespace="homeTitles" filtersNamespace="articleFilters"></custom-titles>
      <assessment-history namespace="homeAssessments"></assessment-history>

      <v-col sm="3" md="2" v-show="filtersVisible">
        <filters class="frozen"></filters>
      </v-col>

      <div v-show="filtersHidden" @click="hideAssessments" class="mt-5 grippy-container frozen">
        <v-row justify="center" align="center" no-gutters class="fill-height">
          <span class="grippy">.. .. .. ..</span>
        </v-row>
      </div>

      <v-col md="7" cols="8" :offset="$vuetify.breakpoint.smAndDown ? 0 : 1" >
        <article-holder detailsNamespace="homeArticleDetails" filtersNamespace="articleFilters"
          assessmentsNamespace="homeAssessments" titlesNamespace="homeTitles"
          :class="{'pt-5': !$vuetify.breakpoint.smAndDown}">
       </article-holder>
      </v-col>

      <v-col>
        <assessments-container namespace="homeAssessments" class="frozen">
        </assessments-container>
      </v-col>

    </v-row>

    <article-details detailsNamespace="homeArticleDetails"
     filtersNamespace="articleFilters"> </article-details>

  </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'
import articleHolder from '@/components/ArticleHolder'
import articleDetails from '@/components/ArticleDetails'
import assessmentsContainer from '@/components/AssessmentsContainer'
import boostersList from '@/components/BoostersList'
import customTitles from '@/components/CustomTitles'
import assessmentHistory from '@/components/AssessmentHistory'
import Filters from '@/components/Filters'
import Loading from '@/components/Loading'

import postServices from '@/services/postServices'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'custom-toolbar': customToolbar,
    'article-holder': articleHolder,
    'article-details': articleDetails,
    'assessments-container': assessmentsContainer,
    'boosters-list': boostersList,
    'custom-titles': customTitles,
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
   this.setBoostersVisibility(false);
   this.setTitlesVisibility(false);
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
     'showArticleDrawer',
     'setBoostersVisibility'
   ]),
   ...mapActions('homeTitles', [
     'setTitlesVisibility'
   ])
 }
}
</script>


<style scoped>
.grippy-container {
  background-color: #424242;
  height: 14vh;
  width: calc(1% + 0.4em);
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
