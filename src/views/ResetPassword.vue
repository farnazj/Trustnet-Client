<template>
  <v-container fluid>

    <custom-toolbar></custom-toolbar>

    <v-row no-gutters class="pt-5 full-height" justify="center" align="center" fill-height>
      <v-col md="4" cols="6">
        <v-alert v-model="info" :type="type">
          {{alertMessage}}
        </v-alert>

        <v-form ref="resetPasswordForm" v-if="!loginVisible">
          <v-card>
            <v-container fluid>
              <v-row no-gutters justify="center">
                <v-card-title primary-title >
                  <h4 class="headline">Enter your new password</h4>
                </v-card-title>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="password" type="password" label="Password"
                  tabindex="5" required :rules="formRules.passwordRules">
                </v-text-field>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="match" type="password" label="Type password again"
                  tabindex="6" required>
                </v-text-field>
              </v-row>


            <v-row no-gutters justify-center>
              <v-card-actions class="mb-2">
                <v-btn tabindex="3" depressed color="primary" @click="resetPassword">Submit</v-btn>
              </v-card-actions>
            </v-row>
          </v-container>

          </v-card>
        </v-form>

        <v-fade-transition v-if="loginVisible">
          <v-card>
            <v-container>
              <v-row no-gutters justify="center">
                <v-card-title primary-title>
                  <h3 class="headline">Proceed to Log in</h3>
                </v-card-title>
              </v-row>

              <v-row no-gutters justify="center">
                <v-card-actions>
                  <v-btn tabindex="8" depressed @click="goToLogin">Go to login</v-btn>
                </v-card-actions>
              </v-row>
            </v-container>
          </v-card>
        </v-fade-transition>

      </v-col>
    </v-row>
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
