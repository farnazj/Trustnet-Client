<template>
  <v-container class="pt-5">
      <v-layout v-for="article in articles" v-bind:key="article.id">
        <article-preview v-bind:post="article.Post"
        v-bind:boosters="article.Boosters"></article-preview>
      </v-layout>
  </v-container>
</template>

<script>
import {mapState, mapActions} from 'vuex';

import ArticlePreview from '../components/ArticlePreview'
import infiniteScroll from '../mixins/infiniteScroll'

  export default {
    components: {
      'article-preview': ArticlePreview
    },
    data: () => {
      return {
        //articles: [],
        //url: 'http://localhost:3000/boosts'
      }
  },
  created() {
    // this.$http.get(this.url + '?limit='+ this.limit + "&offset=" + this.offset,
    //   {credentials: true}
    // ).then(response => {
    //   return response.body;
    // }).then(posts => {
    //   this.articles = posts;
    // }).catch(error => console.log(error))
    this.$store.dispatch('articleFilters/getMoreBoosts')

  },
  computed : {
    ...mapState('articleFilters', {
      articles: state => state.articles,
      offset: state => state.offset,
      limit: state => state.limit
    })
  },
  methods: {
    extend: function() {
      this.$store.dispatch('articleFilters/getMoreBoosts')
    },
    ...mapActions('articleFilters', [
      'getMoreBoosts'
    ])
  },
  mixins : [infiniteScroll]

}
</script>

<style>

</style>
