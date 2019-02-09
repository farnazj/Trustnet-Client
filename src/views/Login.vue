<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Sign in</h1>
     <label>Email</label>
     <input required v-model="username" type="text" placeholder="username"/>
     <label>Password</label>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr/>
     <button type="submit">Login</button>
   </form>
 </div>
</template>

<script>


export default {
  data(){
    return {
      username : "",
      password : ""
    }
  },
  methods: {
   login: function () {
     let username = this.username
     let password = this.password
     this.$store.dispatch('auth/login',
     { 'username': username,
      'password': password })
    .then(() => {
      console.log(' sth')
      this.$router.push('/');
    }).catch(err => console.log(err))
   }
  }
}

</script>
