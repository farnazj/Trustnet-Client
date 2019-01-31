<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>

        <v-card>
          <v-layout row>
            <v-flex xs4>
              <v-layout col align-center justify-center fill-height>
                <v-flex xs12>
                  <v-img v-if="post.image" v-bind:src="post.image" contain> </v-img>


                </v-flex>
              </v-layout>

            </v-flex>

            <v-flex xs5>
              <v-layout row>
                <v-flex xs12>
                  <v-card-title primary-title>
                   <div>
                     <h2 class="mb-2">{{post.title}}</h2>
                     <div>{{post.description}}</div>
                   </div>
                </v-card-title>

                </v-flex>
              </v-layout>

            </v-flex>

            <v-flex xs3>
              <v-layout col justify-space-around fill-height wrap>

                    <v-flex d-flex xs12>
                      <v-icon>fas fa-check</v-icon>
                      <!-- <v-avatar v-for: color="red">
                        <span class="white--text headline">J</span>
                      </v-avatar> -->
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

          <v-layout row>
          </v-layout>

          </v-card>

      </v-flex>

    </v-layout>


  </v-container>
</template>

<script>

  export default {
    props: ['post', 'boosters'],
    data: () => {
      return {
        assessments: [],
      }
    },
    methods: {
    },
    created() {
    }
  //   watch: {
  //     post: function(){
  //       console.log('beginning')
  //       this.$http.get('http://localhost:3000/follows',
  //         {credentials: true}
  //       ).then(response => {
  //         response.body.forEach(user => {
  //           this.$http.get('http://localhost:3000/' + this.post.id + '/' + user.userName + '/assessment/',
  //           {credentials: true}
  //         ).then(assessment => {
  //           console.log(assessment, user.userName);
  //           })
  //         })
  //       })
  //     }
  //
  // }
}
</script>

<style>

</style>
