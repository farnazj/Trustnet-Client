<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row>
      <loading></loading>
      <boosters-list detailsNamespace="homeArticleDetails"></boosters-list>
      <assessment-history namespace="homeAssessments"></assessment-history>

      <v-flex xs3 md2 v-show="!visible">
        <filters class="left-frozen"></filters>
      </v-flex>

      <div v-show="visible" @click="hideAssessments" class="mt-5 grippy-container left-frozen">
        <v-layout row justify-center align-center fill-height>
          <span class="grippy">.. .. .. ..</span>
        </v-layout>
      </div>

      <v-flex xs7  :offset-xs1="!visible" :class="{'pl-4':visible}" >
        <article-holder detailsNamespace="homeArticleDetails" filtersNamespace="articleFilters"
          assessmentsNamespace="homeAssessments">
       </article-holder>
      </v-flex>

      <v-flex>
        <assessments-container namespace="homeAssessments" class="assessments-container">
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
  data () {
    return {
    }
  },
  computed: {
    ...mapState('homeAssessments', [
     'visible'
   ])
 },
 beforeRouteLeave (to, from, next) {
   this.hideContainer();
   next();
 },
 methods: {
   hideAssessments: function() {
     this.hideContainer();
   },
   ...mapActions('homeAssessments', [
     'hideContainer'
   ])
 }
}
</script>


<style scoped>

.assessments-container {
  position: fixed;
}

.left-frozen {
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
