<template>
  <v-container fluid class="pt-12 px-0">
    <custom-toolbar></custom-toolbar>

    <v-row no-gutters>
      <loading></loading>
      <boosters-list detailsNamespace="singleArticleDetails"></boosters-list>
      <custom-titles titlesNamespace="singleArticleTitles"></custom-titles>
      <assessment-history namespace="singleArticleAssessments"></assessment-history>

      <v-col class="pt-12" md="7" cols="8" :offset="$vuetify.breakpoint.smAndDown ? 0 : 1" >
        <article-preview v-if="post" :post="post" detailsNamespace="singleArticleDetails"
          assessmentsNamespace="singleArticleAssessments" titlesNamespace="singleArticleTitles">
        </article-preview>
      </v-col>

      <v-col>
        <assessments-container namespace="singleArticleAssessments" class="frozen">
        </assessments-container>
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
import assessmentsContainer from '@/components/AssessmentsContainer'
import boostersList from '@/components/BoostersList'
import customTitles from '@/components/CustomTitles'
import assessmentHistory from '@/components/AssessmentHistory'
import Loading from '@/components/Loading'
import assessmentHelpers from '@/mixins/assessmentHelpers'

import postServices from '@/services/postServices'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'custom-toolbar': customToolbar,
    'article-preview': ArticlePreview,
    'article-details': articleDetails,
    'assessments-container': assessmentsContainer,
    'boosters-list': boostersList,
    'custom-titles': customTitles,
    'assessment-history': assessmentHistory,
    'loading': Loading
  },
  props: ['postid'],
  data () {
    return {
      post: null
    }
  },
  computed: {
    ...mapState('homeAssessments', [
     'visible'
   ])
 },
 beforeRouteLeave (to, from, next) {
   this.hideContainer();
   this.setBoostersVisibility(false);
   this.setTitlesVisibility(false);
   next();
 },
 created() {
   if (this.postid)
    this.getArticle();
 },
 methods: {
   /*this function is for the path /posts/:postid which directs to the same
   component as home*/
   getArticle: function() {
     postServices.getBoostByPostId({postId: this.postid})
     .then((res) => {
       //this.showArticleDrawer(res.data);
       this.post = res.data;
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
   ])
 },
 mixins: [assessmentHelpers]
}
</script>
