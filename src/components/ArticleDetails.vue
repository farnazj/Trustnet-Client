<template>
  <v-layout wrap>
    <v-navigation-drawer v-model="articleDetailsVisible"
      temporary right width="950" fixed disable-route-watcher
      >

     <v-card class="full-height">

       <v-layout row class="pa-2" justify-end>
         <v-flex xs4 class="right-align">

           <v-btn flat icon color="blue darken-1" class="mr-4">
             <v-icon >gavel</v-icon>
           </v-btn>

           <v-btn flat icon color="blue darken-1" class="mr-4">
             <v-icon >fas fa-rocket</v-icon>
           </v-btn>

         </v-flex>
       </v-layout>
       <v-divider></v-divider>

       <v-layout row>
         <v-container>


           <v-layout row justify-center class="centered">
             <v-flex xs8>

               <v-card-title primary-title>
                  <div>
                    <div class="headline">{{article.title}}</div>
                  </div>
                </v-card-title>

               <v-img v-if="article.image" :src="article.image" contain class="rounded">
               </v-img>
             </v-flex>
           </v-layout>

           <v-layout row class="my-2">
             <v-flex xs12>
               <v-card-text class="body-text">
                 <p v-if="article.body">
                   {{article.body}}
                 </p>
                 <p v-else-if="article.description">
                   {{article.description}}
                 </p>

               </v-card-text>

             </v-flex>
           </v-layout>

           <v-layout row justify-center class="mt-2">
             <v-flex xs6>
               <v-card-actions>
                 <v-btn outline block color="blue darken-1"
                  :href="article.url" target="_blank">
                   Visit Website</v-btn>

               </v-card-actions>
             </v-flex>
           </v-layout>

         </v-container>


       </v-layout>
     </v-card>

   </v-navigation-drawer>
  </v-layout>

</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data: () => {
    return {
      drawer: null,
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ]
    }
  },
  created() {

  },
  computed: {

    articleDetailsVisible: {
      get: function() {
          return this.drawerVisible;
      },
      set: function(newValue) {
        this.setDrawerVisibility(newValue);
      }
    },
    ...mapState('articleDetails', [
     'drawerVisible',
     'article'
   ])

  },
  methods: {
    ...mapActions('articleDetails', [
      'setDrawerVisibility'
    ])
  },
  directives: {

  }
}
</script>

<style scoped>
.right-align {
  text-align: right;
}

.centered {
  text-align: center;
}

.rounded {
  border-radius: 1%;
}

.body-text {
  font-size: 1.1em;
}

.full-height {
  min-height: 100%;

}
</style>
