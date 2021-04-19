<template>
  <v-container>

    <custom-toolbar></custom-toolbar>

    <v-row justify="center" align="center" fill-height class="pt-5 full-height">

    <article-details detailsNamespace="singleArticleDetails" :customWidth="'100vw'"
     filtersNamespace="articleFilters" :externalUserToken="token">
     </article-details>
    </v-row>

  </v-container>
</template>
<script>
import articleDetails from '@/components/ArticleDetails'
import customToolbar from '@/components/CustomToolbar'
import postServices from '@/services/postServices'
import { mapState, mapActions } from 'vuex'

export default {
    components: {
        'custom-toolbar': customToolbar,
        'article-details': articleDetails
    },
    props: ['postid', 'token'],
    data() {
        return {
            post: null
        }
    },
    created() {
        if (this.postid) {
            this.populateSinglePost()
        }
    },
    computed: {
        ...mapState('singleArticleDetails', [
            'article'
        ])
    },
    methods: {
        populateSinglePost: function() {
            console.log(this.postid, this.token)
            return postServices.getPost({ postId: this.postid })
            .then(res => {
                console.log(res)
                this.showArticleDrawer(res.data);
            })
        },   
        ...mapActions('singleArticleDetails', [
            'showArticleDrawer'
        ])

    }
}
</script>