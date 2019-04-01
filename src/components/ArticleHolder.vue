<template>
  <v-layout row class="pt-5">
    <v-flex xs12>
      <v-layout v-for="article in articles" :key="article.id">
        <article-preview :post="article" @click.native="revealArticleDetails(article)"
          :detailsNamespace="detailsNamespace" :assessmentsNamespace="assessmentsNamespace">
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
  props: {
    detailsNamespace: {
      type: String,
      required: true
    },
    filtersNamespace: {
      type: String,
      required: true
    },
    assessmentsNamespace: {
      type: String,
      required: true
    }
  },
  data: () => {
    return {
    }
  },
  created() {
    //this.$store.dispatch('articleFilters/getMoreBoosts')
    this.refreshArticles();
  },
  computed: {
    articles: function() {
      return this.state.articles;
    },
    username: function() {
      return this.state.username;
    },
    ...mapState({
       state (state) {
         return state[this.filtersNamespace];
       }
    })
  },
  methods: {
    revealArticleDetails: function(article) {
      this.showArticleDrawer(article);
    },
    extend: function() {
      this.getMoreBoosts();
    },
    ...mapActions({
      getMoreBoosts (dispatch, payload) {
        return dispatch(this.filtersNamespace + '/getMoreBoosts', payload)
      },
      refreshArticles (dispatch, payload) {
        return dispatch(this.filtersNamespace + '/refreshArticles', payload)
      }
    }),
    ...mapActions({
      showArticleDrawer (dispatch, payload) {
        return dispatch(this.detailsNamespace + '/showArticleDrawer', payload)
      }
    })
  },
  watch: {
    username: function(val) {
      this.refreshArticles();
    }
  },
  mixins : [infiniteScroll]

}
</script>

<style>

</style>
