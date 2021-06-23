<template>
  <v-container fluid class="pt-12 px-0">
    <custom-toolbar></custom-toolbar>

    <v-row no-gutters>
      <boosters-list detailsNamespace="singleArticleDetails" filtersNamespace="articleFilters"></boosters-list>
      <custom-titles titlesNamespace="singleArticleTitles" filtersNamespace="articleFilters"></custom-titles>
      <assessment-history namespace="singleArticleAssessments"></assessment-history>

      <v-col class="pt-12" md="7" cols="8" :offset="$vuetify.breakpoint.smAndDown ? 0 : 1" >
        <article-preview v-if="post" :post="post" detailsNamespace="singleArticleDetails"
          filtersNamespace="articleFilters"
          assessmentsNamespace="singleArticleAssessments" commentsNamespace="singleArticleComments" titlesNamespace="singleArticleTitles">
        </article-preview>
      </v-col>

      <v-col>
        <engagement-container assessmentsNamespace="singleArticleAssessments" commentsNamespace="singleArticleComments" class="frozen">
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
import assessmentHistory from '@/components/AssessmentHistory'
import assessmentHelpers from '@/mixins/assessmentHelpers'

import postServices from '@/services/postServices'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'custom-toolbar': customToolbar,
    'article-preview': ArticlePreview,
    'article-details': articleDetails,
    'engagement-container': engagementContainer,
    'boosters-list': boostersList,
    'custom-titles': customTitles,
    'assessment-history': assessmentHistory
  },
  props: ['postid'],
  data () {
    return {
      post: null
    }
  },
  created() {
    if (this.postid)
      this.getArticle();
    this.fetchFollows();
    this.fetchTrusteds();
  },
  computed: {
    ...mapState('homeAssessments', [
     'visible'
    ]),
    ...mapState('articleFilters', [
      'articles'
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
      // postServices.getBoostByPostId({postId: this.postid})
      .then( () => {
        //this.showArticleDrawer(res.data);
        this.post = this.articles[0];
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
