<template>
  <v-row>
    <v-col cols="12">

      <v-row v-for="article in articles" :key="article.id">
        <article-preview :post="article" :detailsNamespace="detailsNamespace"
          :assessmentsNamespace="assessmentsNamespace" :titlesNamespace="titlesNamespace">
        </article-preview>
      </v-row>

      <v-row v-if="articlesFetched && !articles.length" justify-center fill-height class="pt-5">
        <v-col cols="8">
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
        </v-col>
      </v-row>

    </v-col>
  </v-row>
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
    },
    titlesNamespace: {
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
    articlesFetched: function() {
      return this.state.articlesFetched;
    },
    ...mapState({
       state (state) {
         return state[this.filtersNamespace];
       }
    })
  },
  methods: {

    extend: function() {

      let preOffset = this.offset;
      this.getMoreBoosts()
      .then(() => {
        let postOffset = this.offset;
        if (preOffset == postOffset)
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
    username: function() {
      this.refreshArticles();
    }
  },
  mixins : [infiniteScroll]

}
</script>
