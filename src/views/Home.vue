<template>
  <v-container>
    <custom-toolbar></custom-toolbar>
    <article-holder></article-holder>
    <HelloWorld></HelloWorld>
  </v-container>
</template>

<script>
import HelloWorld from '../components/HelloWorld'
import CustomToolbar from '../components/CustomToolbar'
import ArticleHolder from '../components/ArticleHolder'

export default {
  name: 'App',
  components: {
    HelloWorld,
    'custom-toolbar': CustomToolbar,
    'article-holder': ArticleHolder
  },
  data () {
    return {
    }
  },
  created() {

  }
}
</script>
