<!--
 @fileoverview A component that is used in the Home and the Profile views and contains the 
 article snippets (Article Previews). This component also holds the TagsContainer, which 
 contains the filtered tags (appearing at the top of the feed).
 This component gets the articles that it passes to Article Previews from a Vuex store module.
 This module is passed as a prop (the filtersNamespace) from the ArticleHolder's parent view to it.
 Because the parent view could be either Profile or Home and can have its separate state of articles, the
 parent has to inform this component which module the component needs to access. Similarly, which
 ArticleDetails, assessments, and titles modules this component should send as a prop to its children
 components need to be given to this component by the parent view (given as props detailsNamespace,
 assessmentNamespace, titlesNamespace).
-->
<template>
  <v-row>
    <v-col cols="12">

      <tags-container class="mt-1" v-if="filteredTags" :tags="filteredTags"
        :filtersNamespace="filtersNamespace" :closable=true :compact=false>
      </tags-container>

      <v-row v-for="article in articles" :key="article.id">
        <article-preview :post="article" :detailsNamespace="detailsNamespace"
        :filtersNamespace="filtersNamespace"
          :assessmentsNamespace="assessmentsNamespace" :titlesNamespace="titlesNamespace">
        </article-preview>
      </v-row>

      <v-row v-if="articlesFetched && !articles.length" justify-center fill-height class="pt-5">
        <v-col cols="8">
          <p>
            <span class="subheading font-weight-light" >
              Looks like we don't have any posts to show you. Maybe you aren't following enough sources?<br/><br/>
              You can follow sources by going to the
            </span>
            <v-icon small>fas fa-users</v-icon>
            <span class="subheading font-weight-bold"> Sources</span>
            <span>
              <span class="subheading font-weight-light"> page</span>
            </span>
            <span class="subheading font-weight-light" >
              which you can find on the toolbar.
            </span>
          </p>
          <p class="subheading font-weight-light">
            You can also visit the <v-icon small>help</v-icon>
            <span class="subheading font-weight-bold"> About</span> page which you can find by clicking on your 
            avatar at the top rightside of the toolbar to learn more about {{siteName}}.
          </p>

        </v-col>
      </v-row>

    </v-col>
  </v-row>
</template>

<script>
import ArticlePreview from '@/components/ArticlePreview'
import tagsContainer from '@/components/TagsContainer'
import infiniteScroll from '@/mixins/infiniteScroll'
import consts from '@/services/constants'
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    'article-preview': ArticlePreview,
    'tags-container': tagsContainer
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
    },
    loadLocked: {
      type: Boolean
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
    filteredTags: function() {
      return this.state.filteredTags;
    },
    siteName: function() {
      return consts.SITE_NAME;
    },
    ...mapState({
       state (state) {
         return state[this.filtersNamespace];
       },
       filters (state, getters) {
         return getters[this.filtersNamespace + '/filters']
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
    },
    filters: function(newVal) {
      this.endOfResults = false;
    },
    loadLocked: function(val) {
      if (val)
        this.scrollDisabled = true;
      else
        this.scrollDisabled = false;
    }

  },
  mixins : [infiniteScroll]

}
</script>
