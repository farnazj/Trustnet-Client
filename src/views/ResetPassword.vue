<template>
  <v-container fluid>
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row class="pt-5 full-height" justify-center align-center fill-height>
      <v-flex xs6 md4 >
        <v-alert v-model="info" :type="type">
          {{alertMessage}}
        </v-alert>

        <v-form ref="resetPasswordForm">
          <v-card>
            <v-container fluid>
              <v-layout row justify-center>
                <v-card-title primary-title >
                  <h4 class="headline">Enter your new password</h4>
                </v-card-title>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="password" type="password" label="Password"
                  tabindex="5" required :rules="formRules.passwordRules">
                </v-text-field>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="match" type="password" label="Type password again"
                  tabindex="6" required>
                </v-text-field>
              </v-layout>

            </v-container>

            <v-layout row justify-center>
              <v-card-actions class="mb-2">
                <v-btn tabindex="3" depressed color="primary" @click="resetPassword">Submit</v-btn>
              </v-card-actions>
            </v-layout>

            <v-fade-transition v-if="loginVisible">
              <v-container>
                <v-divider></v-divider>
                <v-layout row justify-center>
                  <v-card-title primary-title>
                    <h3 class="headline">Proceed to Log in</h3>
                  </v-card-title>
                </v-layout>

                <v-layout row justify-center>
                  <v-card-actions>
                    <v-btn tabindex="8" depressed @click="goToLogin">Go to login</v-btn>
                  </v-card-actions>
                </v-layout>
              </v-container>
            </v-fade-transition>

          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import customToolbar from '@/components/CustomToolbar'
import authServices from '@/services/authServices'

export default {
  components: {
    'custom-toolbar': customToolbar
  },
  props: ['token'],
  data(){
    return {
      password: "",
      match: "",
      formRules: {
        passwordRules: [
          v => (!!v && v) === this.match ||
             'Values do not match'
        ]
      },
      alertMessage: '',
      info: false,
      type: 'info',
      loginVisible: false
    }
  },
  methods: {
    resetPassword: function() {

      if (this.$refs.resetPasswordForm.validate()) {

        authServices.resetPassword(
          {token: this.token},
          {password: this.password})
        .then(response => {
          console.log(response)
          this.alertMessage = response.data.message;
          this.type = 'info';
          this.info = true;
          this.loginVisible = true;
        })
        .catch(err => {
          this.alertMessage = err.response.data.message;
          this.type = 'error';
          this.info = true;
        })
      }
    },
    goToLogin: function() {
      this.$router.push({name: 'login'});
    },
    validateField () {
        this.$refs.resetPasswordForm.validate()
    }
  },
  watch: {
    match: 'validateField'
  }
}
</script>

<style scoped>
.full-height {
  height: 82vh;
}
</style>
