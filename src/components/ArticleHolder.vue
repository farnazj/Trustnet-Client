<template>
  <v-layout row class="pt-5">
    <v-flex xs12>
      <v-layout v-for="article in articles" :key="article.id">
        <article-preview :post="article"></article-preview>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import ArticlePreview from '@/components/ArticlePreview'
import infiniteScroll from '@/mixins/infiniteScroll'

  export default {
    components: {
      'article-preview': ArticlePreview
    },
    data: () => {
      return {
      }
  },
  created() {

    this.$store.dispatch('articleFilters/getMoreBoosts')
  },
  computed: {
    ...mapState('articleFilters', {
      articles: state => state.articles
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
