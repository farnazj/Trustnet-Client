<template>
  <v-layout row class="pt-5">
    <v-flex xs12>
      <v-layout v-for="article in articles" :key="article.id">
        <article-preview :post="article" :detailsNamespace="detailsNamespace"
          :assessmentsNamespace="assessmentsNamespace" :filtersNamespace="filtersNamespace">
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
      sth: true
    }
  },
  created() {
    this.refreshArticles();
  },
  computed: {
    articles: function() {
      return this.state.articles;
    },
    username: function() {
      return this.state.username;
    },
    offset: function() {
      return this.state.offset;
    },
    ...mapState({
       state (state) {
         return state[this.filtersNamespace];
       }
    })
  },
  methods: {

    extend: function() {
      let pre_offset = this.offset;
      this.getMoreBoosts()
      .then(res => {
        let post_offset = this.offset;
        if (pre_offset == post_offset)
          this.endOfResults = true;
        else
          this.endOfResults = false;
      })
    },
    ...mapActions({
      getMoreBoosts (dispatch, payload) {
        return dispatch(this.filtersNamespace + '/getMoreBoosts', payload)
      },
      refreshArticles (dispatch, payload) {
        return dispatch(this.filtersNamespace + '/refreshArticles', payload)
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
