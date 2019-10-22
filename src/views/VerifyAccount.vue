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
