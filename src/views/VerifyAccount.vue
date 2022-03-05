<template>
  <v-container>

    <custom-toolbar></custom-toolbar>

    <v-row justify="center" align="center" fill-height class="pt-5 full-height">
      <loading>Please wait while we verify your account</loading>
      <v-col cols="6" lg="4" align="self-center">
        <v-alert v-model="alert" :type="type">
          {{alertMessage}}
        </v-alert>

        <v-fade-transition v-if="loginVisible">
          <v-card>
            <v-container fluid>
              <v-row justify="center">
                <v-card-title primary-title>
                  <h3 class="headline">Proceed to Log in</h3>
                </v-card-title>
              </v-row>

              <v-row justify="center">
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
import generalLoading from '@/components/GeneralLoading'
import authServices from '@/services/authServices'
import studyServices from '@/services/studyServices'
import { mapActions } from 'vuex'

export default {
  components: {
    'custom-toolbar': customToolbar,
    'loading': generalLoading
  },
  props: ['token', 'mode'],
  data(){
    return {
      type: 'info',
      alert: false,
      alertMessage: '',
      loginVisible: false
    }
  },
  created() {
    this.verify();
  },
  methods: {
    goToLogin: function() {
      this.$router.push({ name: 'login' });
    },
    verify: function() {
      this.setLoading(true);

      let verifyCall;
      if (this.$route.path.indexOf('/verify-new-account/') != -1)
        verifyCall = authServices.verifyNewAccount;
      else
        verifyCall = authServices.verifyExistingAccount;

      verifyCall({ token: this.token })
      .then(response => {

        let prom;
        if (this.mode)
          prom = studyServices.finishStudySignup({ token: this.token}, { specialGroup: this.mode });
        else
          prom = new Promise((resolve) => { resolve(); })

        prom.then(() => {
          this.type = 'info';
          this.alertMessage = response.data.message;
          this.alert = true;
          this.loginVisible = true;
        })
        
      })
      .catch(err => {
        this.alertMessage = err.response.data.message;
        this.type = 'error';
        this.alert = true;
      })
      .finally(() => {
        this.setLoading(false);
      })
    },
    ...mapActions('loader', [
      'setLoading',
    ])
  }

}

</script>
