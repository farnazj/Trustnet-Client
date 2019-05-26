<template>
  <v-container>
    <v-layout row>
      <custom-toolbar></custom-toolbar>
    </v-layout>

    <v-layout justify-center align-center row fill-height class="pt-5 full-height">
      <loading>Please wait while we verify your account</loading>
      <v-flex xs6 lg4 align-self-center>
        <v-alert v-model="alert" :type="type">
          {{alertMessage}}
        </v-alert>

        <v-fade-transition v-if="loginVisible">
          <v-card>
            <v-container fluid>
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
          </v-card>
        </v-fade-transition>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import customToolbar from '@/components/CustomToolbar'
import Loading from '@/components/Loading'
import authServices from '@/services/authServices'
import {mapActions} from 'vuex'

export default {
  components: {
    'custom-toolbar': customToolbar,
    'loading': Loading
  },
  props: ['token'],
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
      this.$router.push({name: 'login'});
    },
    verify: function() {
      this.setLoading(true);
      authServices.verifyAccount({token: this.token})
      .then(response => {
        this.type
        this.alertMessage = response.data.message;
        this.alert = true;
        this.loginVisible = true;
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

<style scoped>
.full-height {
  height: 80vh;
}
</style>
