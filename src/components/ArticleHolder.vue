<template>
  <v-layout row class="pt-5">
    <v-flex xs12>
      <v-layout v-for="article in articles" :key="article.id">
        <article-preview :post="article" @click.native="revealArticleDetails(article)">
        </article-preview>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import ArticlePreview from '@/components/ArticlePreview'
import infiniteScroll from '@/mixins/infiniteScroll'
import { mapState, mapActions } from 'vuex';

  export default {
    components: {
      'article-preview': ArticlePreview,
    },
    data: () => {
      return {
      }
  },
  created() {
    //this.$store.dispatch('articleFilters/getMoreBoosts')
    this.getMoreBoosts();
  },
  computed: {
    ...mapState('articleFilters', {
      articles: state => state.articles
    })
  },
  methods: {
    revealArticleDetails: function(article) {
      this.showArticleDrawer(article);
    },
    extend: function() {
      this.getMoreBoosts();
    },
    ...mapActions('articleFilters', [
      'getMoreBoosts'
    ]),
    ...mapActions('articleDetails', [
      'showArticleDrawer'
    ])
  },
  mixins : [infiniteScroll]

}
</script>

<style>

</style>
