<template>
  <v-container fluid>
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout row class="pt-5 full-height" justify-center align-center fill-height>
      <v-flex xs6 md4 >
        <v-alert v-model="alert" type="info">
          {{alertMessage}}
        </v-alert>

        <v-form ref="emailForm">
          <v-card>
            <v-container fluid>
              <v-layout row justify-center>
                <v-card-title primary-title >
                  <h4 class="headline">Enter your email address to reset your password</h4>
                </v-card-title>
              </v-layout>

              <v-layout row>
                <v-text-field v-model="email" type="email" label="Email"
                  tabindex="4" required :rules="formRules.emailRules">
                </v-text-field>
              </v-layout>

            </v-container>

            <v-layout row justify-center>
              <v-card-actions class="mb-2">
                <v-btn tabindex="3" depressed color="primary" @click="sendEmail" :disabled="disabled">Submit</v-btn>
              </v-card-actions>
            </v-layout>

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
  data(){
    return {
      email: "",
      formRules: {
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ]
      },
      alertMessage: '',
      alert: false,
      disabled: false
    }
  },
  methods: {
    sendEmail: function() {

      if (this.$refs.emailForm.validate()) {

        authServices.forgotPassword({email: this.email})
        .then(response => {
          this.alertMessage = response.data.message;
          this.alert = true;
          this.disabled = true;
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style scoped>
.full-height {
  height: 70vh;
}
</style>
