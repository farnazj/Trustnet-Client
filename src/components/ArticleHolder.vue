<template>
  <v-container>
    <v-container>
      <v-layout v-for="article in articles" v-bind:key="article.id">
        <article-preview v-bind:post="article"></article-preview>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import ArticlePreview from '../components/ArticlePreview'

  export default {
    components: {
      'article-preview': ArticlePreview
    },
    data: () => {
      return {
        articles: []
      }
  },
  created() {
    //fetch boosts (articles)
  }
}
</script>

<style>

</style>
