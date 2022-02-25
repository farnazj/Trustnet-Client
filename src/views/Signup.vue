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

              <v-row no-gutters class="pt-5">
                <p class="body-2 mb-0">{{siteName}} is a research platform intended to help people navigate their social information space.
                  Do you give us your consent to use your data in our research analyses and subsequent publications?
                </p>
                <v-radio-group v-model="user.consent" required :rules="formRules.consentRules" class="mt-1">
                  <v-radio label="Yes" value="true"></v-radio>
                  <v-radio label="No" value="false"></v-radio>
                </v-radio-group>
                
                <span class="caption">You can withdraw your consent later should you wish by visiting the Settings page of the website.</span>
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
import consts from '@/services/constants'

export default {
  components: {
    'custom-toolbar': customToolbar
  },
  props: ['mode'],
  data(){
    return {
      user: {
        firstName: "",
        lastName: "",
        username : "",
        email: "",
        password : "",
        consent: null
        // type: 'info'
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
        ],
        consentRules: [
          v => !!v || 'Please tell us whether you would like to consent.',
        ]
      },
      alert: false,
      alertMessage: '',
      type: 'info',
      buttonDisabled: false
    }
  },
  computed: {
     siteName: function() {
      return consts.SITE_NAME;
    }
  },
  methods: {
    signup: function() {

      if (this.$refs.signupForm.validate()) {

        let data = this.user;
        if (this.mode == 'user-study')
          data.userStudy = true;

        this.$store.dispatch('auth/signup', data)
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
