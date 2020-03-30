<template>
  <v-container>

    <custom-toolbar></custom-toolbar>

    <v-row justify="center" align="center" fill-height class="pt-5 full-height">
      <v-col xs="10" sm="8" md="6" lg="4" align-self="center">
        <v-alert v-model="alert" :type="type">
          {{alertMessage}}
        </v-alert>

        <v-form ref="signupForm" lazy-validation>
          <v-card>
            <v-container fluid>
              <v-row justify="center">
                <v-card-title primary-title>
                  <h3 class="headline">Sign up for an account</h3>
                </v-card-title>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="user.firstName" label="First name"
                  tabindex="1" required :rules="formRules.nameRules">
                </v-text-field>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="user.lastName" label="Last name"
                  tabindex="2" required :rules="formRules.nameRules">
                </v-text-field>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="user.username" label="Username"
                  tabindex="3" required>
                </v-text-field>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="user.email" type="email" label="Email"
                  tabindex="4" required :rules="formRules.emailRules">
                </v-text-field>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="user.password" type="password" label="Password"
                  tabindex="5" required :rules="formRules.passwordRules">
                </v-text-field>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="match" type="password" label="Type password again"
                  tabindex="6" required>
                </v-text-field>
              </v-row>

            </v-container>

            <v-row no-gutters justify="center">
              <v-card-actions class="mb-2">
                <v-btn tabindex="7" depressed color="primary" @click="signup" :disabled="buttonDisabled">
                  Signup</v-btn>
              </v-card-actions>
            </v-row>

            <v-divider></v-divider>

            <v-row no-gutters justify="center">
              <v-card-title primary-title>
                <h3 class="headline">Or Log in</h3>
              </v-card-title>
            </v-row>

            <v-row no-gutters justify="center">
              <v-card-actions>
                <v-btn tabindex="8" depressed @click="goToLogin">Go to login</v-btn>
              </v-card-actions>
            </v-row>

          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import customToolbar from '@/components/CustomToolbar'

export default {
  components: {
    'custom-toolbar': customToolbar
  },
  data(){
    return {
      user: {
        firstName: "",
        lastName: "",
        username : "",
        email: "",
        password : "",
        type: 'info'
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
      alertMessage: '',
      type: 'info',
      buttonDisabled: false
    }
  },
  methods: {
    signup: function() {

      if (this.$refs.signupForm.validate()) {

        this.$store.dispatch('auth/signup', this.user)
        .then(response => {
          this.type = 'info';
          this.alertMessage = response.data.message;
          this.alert = true;
          this.buttonDisabled = true;
        })
        .catch(err => {
          this.alertMessage = err.response.data.message;
          this.type = 'error';
          this.alert = true;
        })
      }
    },
    goToLogin: function() {
      this.$router.push({ name: 'login' });
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
