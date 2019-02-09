<template>
  <v-container fluid class="px-0">
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row>

      <v-flex xs2></v-flex>
      <v-flex xs7>
        <article-holder></article-holder>
      </v-flex>
      <v-flex class="right-frozen">
        <assessments-container v-if="visible"></assessments-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CustomToolbar from '../components/CustomToolbar'
import ArticleHolder from '../components/ArticleHolder'
import AssessmentsContainer from '../components/AssessmentsContainer'

import { mapGetters } from 'vuex'


export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'article-holder': ArticleHolder,
    'assessments-container': AssessmentsContainer
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('assessments', [
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
</style>
