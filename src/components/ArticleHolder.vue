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
import infiniteScroll from '../mixins/infiniteScroll'

  export default {
    components: {
      'article-preview': ArticlePreview
    },
    data: () => {
      return {
        articles: [],
        url: 'http://localhost:3000/boosts'
      }
  },
  created() {
    this.$http.get(this.url + '?limit='+ this.limit + "&offset=" + this.offset,
      {credentials: true}
    ).then(response => {
      return response.body;
    }).then(posts => {
      this.articles = posts;
    }).catch(error => console.log(error))

  },
  computed : {
    extension: function() {
      return this.articles;
    }
  },
  mixins : [infiniteScroll]

}
</script>

<style>

</style>
