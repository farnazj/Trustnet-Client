<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row>
      <loading></loading>

      <v-flex xs2>
        <filters class="left-frozen"></filters>
      </v-flex>
      <v-flex xs7>
        <article-holder detailsNamespace="homeArticleDetails"
         filtersNamespace="articleFilters"></article-holder>
      </v-flex>
      <v-flex class="right-frozen">
        <assessments-container v-if="visible"></assessments-container>
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
import Filters from '@/components/Filters'
import Loading from '@/components/Loading'

import { mapState } from 'vuex'


export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'article-holder': ArticleHolder,
    'article-details': ArticleDetails,
    'assessments-container': AssessmentsContainer,
    'filters': Filters,
    'loading': Loading
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('assessments', [
     'visible',
   ])
  }
}
</script>


<style scoped>

.right-frozen {
  position: fixed;
  right: 0px;
  width: 22%;
}

.left-frozen {
  position: fixed;
}
</style>
