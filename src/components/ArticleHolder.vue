<template>
  <v-container class="pt-5">
      <v-layout v-for="article in articles" v-bind:key="article.id">
        <article-preview v-bind:post="article.Post"
        v-bind:boosters="article.Boosters"></article-preview>
      </v-layout>
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
        articles: [],
        users: []
      }
  },
  created() {
    this.$http.get('http://localhost:3000/',
      {credentials: true}
    ).then(response => {
      return response.body;
    }).then(posts => {
      this.articles = posts;
    }).catch(error => console.log(error))

  }
}
</script>

<style>

</style>
