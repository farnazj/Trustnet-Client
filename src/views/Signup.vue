<template>
  <v-container>
    <v-layout justify-center align-center row fill-height>
      <v-flex xs6 lg4 align-self-center>
        <v-alert v-model="alert" type="error">
          {{alertMessage}}
        </v-alert>

        <v-form ref="signupForm" lazy-validation>
          <v-card>
            <v-container fluid>
              <v-layout row justify-center>
                <v-card-title primary-title >
                  <h3 class="headline">Sign up for an account</h3>
                </v-card-title>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="user.firstName"
                  label="First name" required :rules="formRules.nameRules">
                </v-text-field>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="user.lastName"
                  label="Last name" required :rules="formRules.nameRules">
                </v-text-field>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="user.username"
                  label="Username" required>
                </v-text-field>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="user.email" type="email"
                  label="Email" required :rules="formRules.emailRules">
                </v-text-field>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="user.password" type="password"
                  label="Password" required :rules="formRules.passwordRules">
                </v-text-field>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="match" type="password"
                  label="Type password again" required>
                </v-text-field>
              </v-layout>

            </v-container>

            <v-layout row justify-center>
              <v-card-actions class="mb-2">
                <v-btn depressed color="primary" @click="signup">Signup</v-btn>
              </v-card-actions>
            </v-layout>


            <v-divider></v-divider>
            <v-layout row justify-center>
              <v-card-title primary-title>
                <h3 class="headline">Or Log in</h3>
              </v-card-title>
            </v-layout>

            <v-layout row justify-center>
              <v-card-actions>
                <v-btn depressed @click="goToLogin">Go to login</v-btn>
              </v-card-actions>
            </v-layout>

          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import authServices from '@/services/authServices'

export default {
  data(){
    return {
      user: {
        firstName: "",
        lastName: "",
        username : "",
        email: "",
        password : "",
      },
      match: "",
      formRules: {
        emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
        nameRules: [
          v => !!v || 'Field is required',
          v => /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(v)
            || 'Name must be valid'
        ],
        usernameRules: [
          v => !!v || 'Username is required'
        ],
        passwordRules: [
          v => (!!v && v) === this.match ||
             'Values do not match'
        ]
      },
      alert: false,
      alertMessage: ''
    }
  },
  methods: {
    signup: function() {
      if (this.$refs.signupForm.validate()) {

        this.$store.dispatch('auth/signup', this.user)
        .then(() => {
          let credentials = {
            username: this.user.username,
            password: this.user.password
          }
          this.$store.dispatch('auth/login', credentials)
          .then(() => {
            this.$router.push('/');
          })

        })
        .catch(err => {
          this.alertMessage = err.response.data.message;
          this.alert = true;
        })

      }
    },
    goToLogin: function() {
      this.$router.push('/login');
    },
    validateField () {
        this.$refs.signupForm.validate()
      }
  },
  watch: {
    match: 'validateField'
  }
}

</script>

<style scoped>

</style>
