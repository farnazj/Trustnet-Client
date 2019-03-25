<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row>
      <loading></loading>
      <boosters-list detailsNamespace="homeArticleDetails"></boosters-list>

      <v-flex xs2>
        <filters class="left-frozen"></filters>
      </v-flex>
      <v-flex xs7>
        <article-holder detailsNamespace="homeArticleDetails" filtersNamespace="articleFilters"
          assessmentsNamespace="homeAssessments">
       </article-holder>
      </v-flex>
      <v-flex class="assessments-container">
        <assessments-container namespace="homeAssessments">
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
import Filters from '@/components/Filters'
import Loading from '@/components/Loading'

import { mapState } from 'vuex'


export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'article-holder': ArticleHolder,
    'article-details': ArticleDetails,
    'assessments-container': AssessmentsContainer,
    'boosters-list': boostersList,
    'filters': Filters,
    'loading': Loading
  },
  data () {
    return {
    }
  }
}
</script>


<style scoped>

.assessments-container {
  position: fixed;
  right: 0px;
  width: 22%;
  height: 97vh;
  overflow-y: auto;
}

.left-frozen {
  position: fixed;
}
</style>
