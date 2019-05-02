<template>
  <v-layout row class="pt-5">
    <v-flex xs12>
      <v-layout v-for="article in articles" :key="article.id">
        <article-preview :post="article" :detailsNamespace="detailsNamespace"
          :assessmentsNamespace="assessmentsNamespace" :filtersNamespace="filtersNamespace">
        </article-preview>
      </v-layout>
      <v-layout v-if="articles_fetched && !articles.length" justify-center  fill-height class="pt-5">
        <v-flex xs8>
          <span class="subheading font-weight-light" >
            Looks like we don't have any posts to show you. Maybe you aren't following enough sources?<br/><br/>
            You can follow sources by clicking on your avatar at the
            right side of the top toolbar, and going to the
          </span>
          <v-icon small>account_circle</v-icon>
          <span class="subheading font-weight-bold"> Sources</span>
          <span>
            <span class="subheading font-weight-light"> page.</span>
          </span>
        </v-flex>

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
    articles_fetched: function() {
      return this.state.articles_fetched;
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
