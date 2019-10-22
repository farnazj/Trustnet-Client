<template>
  <v-container fluid class="pt-12">
    <custom-toolbar></custom-toolbar>

    <v-row no-gutters class="pt-5 full-height" justify="center" align="center" fill-height>
      <v-col cols="6" md="4" >
        <v-alert v-model="alert" type="info">
          {{alertMessage}}
        </v-alert>

        <v-form ref="emailForm">
          <v-card>
            <v-container fluid>
              <v-row no-gutters justify="center" >
                <v-card-title primary-title class="no-break-word">
                  <h4 class="headline">Enter your email address to reset your password</h4>
                </v-card-title>
              </v-row>

              <v-row no-gutters >
                <v-text-field v-model="email" type="email" label="Email"
                  tabindex="4" required :rules="formRules.emailRules">
                </v-text-field>
              </v-row>

            </v-container>

            <v-row justify="center" no-gutters >
              <v-card-actions class="mb-2">
                <v-btn tabindex="3" depressed color="primary" @click="sendEmail" :disabled="disabled">Submit</v-btn>
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
