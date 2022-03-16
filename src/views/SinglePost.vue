<template>
  <v-container fluid class="pt-12 px-0">
    <custom-toolbar></custom-toolbar>

    <v-row no-gutters>
      <boosters-list detailsNamespace="singleArticleDetails" filtersNamespace="articleFilters"></boosters-list>
      <custom-titles titlesNamespace="singleArticleTitles" filtersNamespace="articleFilters"></custom-titles>
      <engagement-history assessmentsNamespace="singleArticleAssessments" commentsNamespace="singleArticleComments"></engagement-history>

      <v-col class="pt-12 ml-1" md="7" cols="8" >
        <article-preview v-if="post" :post="post" detailsNamespace="singleArticleDetails"
          filtersNamespace="articleFilters"
          assessmentsNamespace="singleArticleAssessments" commentsNamespace="singleArticleComments" titlesNamespace="singleArticleTitles">
        </article-preview>
      </v-col>

      <v-col md="5" cols="4">
        <engagement-container assessmentsNamespace="singleArticleAssessments" commentsNamespace="singleArticleComments" class="single-post-engagements frozen">
        </engagement-container>
      </v-col>
    </v-row>

    <article-details detailsNamespace="singleArticleDetails"
     filtersNamespace="articleFilters" @assessmentUpdate="getArticle"> </article-details>

  </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'
import ArticlePreview from '@/components/ArticlePreview'
import articleDetails from '@/components/ArticleDetails'
import engagementContainer from '@/components/EngagementContainer'
import boostersList from '@/components/BoostersList'
import customTitles from '@/components/CustomTitles'
import engagementHistory from '@/components/EngagementHistory'
import assessmentHelpers from '@/mixins/assessmentHelpers'

import consts from '@/services/constants'

import { mapState, mapActions } from 'vuex'

const { INITIAL_TOP_LEVEL_COMMENTS_LIMIT } = consts;


export default {
  components: {
    'custom-toolbar': customToolbar,
    'article-preview': ArticlePreview,
    'article-details': articleDetails,
    'engagement-container': engagementContainer,
    'boosters-list': boostersList,
    'custom-titles': customTitles,
    'engagement-history': engagementHistory
  },
  props: ['postid'],
  data () {
    return {
      post: null,
      initialTopLevelCommentsLimit: INITIAL_TOP_LEVEL_COMMENTS_LIMIT

    }
  },
  created() {
    if (this.postid)
      this.getArticle();

    this.fetchFollows();
    this.fetchTrusteds();

    console.log('comment limit', this.initialTopLevelCommentsLimit)
  },
  computed: {
    ...mapState('singleArticleAssessments', [
     'visible'
    ]),
    ...mapState('articleFilters', [
      'articles'
    ]),
    ...mapState('singleArticleComments', [
      'commentState'
    ])
  },
  beforeRouteLeave (to, from, next) {
    this.hideContainer();
    this.setBoostersVisibility(false);
    this.setTitlesVisibility(false);
    next();
  },
  methods: {
    getArticle: function() {
      this.getSingleArticle({ postId: this.postid })
      
      .then( () => {
        //this.showArticleDrawer(res.data);
        this.post = this.articles[0];
        this.getInitialComments();
        Promise.all(this.restructureAssessments())
        .then(() => {
          this.showAssessments({
            assessments: this.assessments,
            postIdOfAssessments: this.postid
          });
        })

      })
    },
    hideAssessments: function() {
      this.hideContainer();
    },
    getInitialComments: function() {
    
      this.clearComments()
      .then(() => {
        return this.getPostComments({
          postIdOfComments: this.postid,
          limit: this.initialTopLevelCommentsLimit,
          offset: 0
        })
      })
      
    },
    ...mapActions('singleArticleAssessments', [
      'hideContainer',
      'showAssessments'
    ]),
    ...mapActions('singleArticleDetails', [
      'showArticleDrawer',
      'setBoostersVisibility'
    ]),
    ...mapActions('singleArticleTitles', [
      'setTitlesVisibility'
    ]),
    ...mapActions('relatedSources', [
    'fetchFollows',
    'fetchTrusteds'
    ]),
    ...mapActions('articleFilters', [
      'getSingleArticle'
    ]),
    ...mapActions('singleArticleComments', [
      'getPostComments',
      'clearComments'
    ])
  },
  watch: {
    articles: function(newVal) {
      this.post = newVal[0];
    }
  },
  mixins: [assessmentHelpers]
}
</script>

<style scoped>
.single-post-engagements {
  width: 40%;
}
</style>
