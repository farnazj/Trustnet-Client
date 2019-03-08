<template>
  <v-container>
    <v-layout justify-center align-center row fill-height>
      <v-flex xs6 md4 align-self-center>
        <v-alert v-model="alert" type="error">
          {{alertMessage}}
        </v-alert>

        <v-form>
          <v-card>
            <v-container fluid>
              <v-layout row justify-center>
                <v-card-title primary-title >
                  <h3 class="headline">Log into your account</h3>
                </v-card-title>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="username"
                  label="Username" required>
                </v-text-field>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="password" type="password"
                  label="Password" required>
                </v-text-field>
              </v-layout>

            </v-container>

            <v-layout row justify-center>
              <v-card-actions class="mb-2">
                <v-btn depressed color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-layout>

            <v-divider ></v-divider>
            <v-layout row justify-center>
              <v-card-title primary-title>
                <h3 class="headline">Or sign up</h3>
              </v-card-title>
            </v-layout>

            <v-layout row justify-center>
              <v-card-actions>
                <v-btn depressed @click="goToSignup">Go to signup</v-btn>
              </v-card-actions>
            </v-layout>

          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>

export default {
  data(){
    return {
      username : "",
      password : "",
      alert: false,
      alertMessage: ''
    }
  },
  methods: {
   login: function () {
     let username = this.username
     let password = this.password
     this.$store.dispatch('auth/login',
      {
        'username': username,
        'password': password
      })
      .then(() => {
        this.$router.push('/');
      })
      .catch(err => {
        this.alertMessage = err.response.data.message;
        this.alert = true;
      })
    },
    goToSignup: function() {
      this.$router.push('/signup');
    }
  }
}

</script>

<style scoped>

</style>
