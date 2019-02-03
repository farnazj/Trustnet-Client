<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>


export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      //
    }
  },
  created() {

    //TODO: change
    this.$http.post('http://localhost:3000/login', {
      'username': 'saruman', 'password':"i'mevil"},
      {credentials: true}
    ).then(response => {
      console.log("inja", response)
    });


  }
}
</script>
