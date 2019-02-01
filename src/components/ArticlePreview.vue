<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>

        <v-card class="pa-1">
          <v-layout row>
            <v-flex xs4>
              <v-layout col fill-height>
                <v-flex xs12>
                  <v-img v-if="post.image" v-bind:src="post.image" contain class="rounded"> </v-img>


                </v-flex>
              </v-layout>

            </v-flex>

            <v-flex xs5>
              <v-layout row>
                <v-flex xs12>
                  <v-card-title primary-title class="pt-0">
                   <div>
                     <h3 class="mb-2">{{post.title}}</h3>
                     <p>{{post.description}}</p>
                   </div>
                </v-card-title>

                </v-flex>
              </v-layout>

            </v-flex>

            <v-flex xs3>
              <v-layout col justify-space-around fill-height wrap>

                    <v-flex d-flex xs12>
                      <v-icon>fas fa-check</v-icon>

                      <!-- <custom-avatar></custom-avatar> -->
                    </v-flex>

                    <v-flex d-flex xs12>
                      <v-icon>fas fa-times</v-icon>
                    </v-flex>


                    <v-flex d-flex xs12>
                      <v-icon>fas fa-question</v-icon>
                    </v-flex>


              </v-layout>

            </v-flex>

          </v-layout>

          <v-layout row >
            <v-flex xs12 >
              <v-icon >fas fa-rocket</v-icon> <span class="mr-3"> Boosted by</span>
              <custom-avatar v-for="booster in boosters" v-bind:key="booster.id" v-bind:user="booster"></custom-avatar>
            </v-flex>
          </v-layout>

          </v-card>

      </v-flex>

    </v-layout>


  </v-container>
</template>

<script>
  import customAvatar from '../components/CustomAvatar'

  export default {
    components: {
     'custom-avatar': customAvatar
    },
    props: ['post', 'boosters'],
    data: () => {
      return {
        assessments: []
      }
    },
    methods: {
    },
    created() {

      //this.boosters.forEach(boos)
      //this.$http.get('')
      // console.log('beginning')
      // this.$http.get('http://localhost:3000/trusteds',
      //   {credentials: true}
      // ).then(response => {
      //   response.body.forEach(user => {
      //     this.$http.get('http://localhost:3000/' + this.post.id + '/' + user.userName + '/assessment/',
      //     {credentials: true}
      //   ).then(assessment => {
      //     console.log(assessment, user.userName);
      //   }).catch(err => console.log(err))
      //
      //   })
      // })
    }



}
</script>

<style scoped>

.rounded {
  border-radius: 2%;
}
</style>
