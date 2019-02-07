<template>
  <v-container>
    <v-layout>

      <v-flex xs2></v-flex>
      <v-flex xs10>
        <custom-toolbar></custom-toolbar>
        <article-holder></article-holder>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CustomToolbar from '../components/CustomToolbar'
import ArticleHolder from '../components/ArticleHolder'

export default {
  components: {
    'custom-toolbar': CustomToolbar,
    'article-holder': ArticleHolder
  },
  data () {
    return {
    }
  },
  created() {

  }
}
</script>
