<template>
  <v-container fluid class="px-0">
    <custom-toolbar></custom-toolbar>

    <v-row class="pt-8 full-height-login" justify="center" align="center" no-gutters fill-height >

      <v-col lg="6" md="6" sm="12" xs="12" order-md="first"  order="last" :class="{ 'mt-4': $vuetify.breakpoint.smAndDown}">
        <v-card outlined tile :height="$vuetify.breakpoint.mdAndUp ? '95vh' : '100%'" color="blue-grey darken-3">
          <v-container fluid fill-height>
            <v-row no-gutters>

              <v-card-text :class="['intro-container', $vuetify.breakpoint.mdAndDown ? 'pt-10 px-10 pb-0': 'pa-16']">
                <p class="body-1 intro-text font-weight-light mb-5">
                  The Trustnet ecosystem was designed to give users more power over the content on the web&#8212;so that they can assess any content as accurate or inaccurate and see the assessments of those they trust.
                </p>

                <p class="body-1 font-weight-light">
                  The Trustnet ecosystem consists of:
                  <ul>
                    <li class="custom-list-item intro-text">
                      - <span class="font-weight-medium">The Trustnet website</span> here which lets you filter your newsfeed by the accuracy assessments provided by those you trust. <a href="/about/platform" target="_blank" class="custom-plain-link" >Learn more</a>
                    </li>
                    <li class="custom-list-item intro-text">
                      - <span class="font-weight-medium"><a href="https://chrome.google.com/webstore/detail/trustnet/nphapibbiamgbhamgmfgdeiiekddoejo" target="_blank" class="custom-plain-link">The Trustnet extension</a></span> which lets you assess any content on the web right on the page where the content is and also enables you to see content assessments from those you trust. <a href="/about/extension" target="_blank" class="custom-plain-link" >Learn more</a>
                    </li>
                    <li class="custom-list-item intro-text">
                      - <span class="font-weight-medium"><a href="https://chrome.google.com/webstore/detail/reheadline/iignpdlabbnnacdkchpnpljkhdlkblbh" target="_blank" class="custom-plain-link">The Reheadline extension</a></span> which enables you to submit alternative headlines for news articles and to also see alternative headlines suggested by those you follow or trust anywhere on the web where you encounter the original headlines. <a href="/about/reheadline" target="_blank" class="custom-plain-link" >Learn more</a>
                    </li>
                  </ul>
                  
                </p>

              </v-card-text>
            </v-row>

          </v-container>
        </v-card>
      </v-col>

      <v-col cols="12" sm="8" md="6" lg="6">
        <v-alert v-model="alert" type="error">
          {{alertMessage}}
        </v-alert>

        <v-row no-gutters justify="center" align="center" >
          <v-col md="9" xs="10" :class="{ 'mt-7': $vuetify.breakpoint.smAndDown, 'mb-3': $vuetify.breakpoint.smAndDown} ">
             <v-form>
          <v-card>
            <v-container fluid>
              <v-row justify="center" no-gutters>
                <v-card-title primary-title >
                  <h3 class="headline">Log into your account</h3>
                </v-card-title>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="username" tabindex="1"
                  label="Username" @keyup.enter="login" required>
                </v-text-field>
              </v-row>

              <v-row no-gutters>
                <v-text-field v-model="password" type="password" tabindex="2"
                  label="Password" @keyup.enter="login" required>
                </v-text-field>
              </v-row>

              <v-row no-gutters>
                <a @click.prevent="goToPasswordReset">Forgot your password?</a>
              </v-row>

            </v-container>

            <v-row justify="center" no-gutters>
              <v-card-actions class="mb-2">
                <v-btn tabindex="3" depressed color="primary" @click="login">Login</v-btn>
              </v-card-actions>
            </v-row>

            <v-divider ></v-divider>
            <v-row justify="center" no-gutters>
              <v-card-title primary-title>
                <h3 class="headline">Or sign up</h3>
              </v-card-title>
            </v-row>

            <v-row justify="center" no-gutters>
              <v-card-actions>
                <v-btn tabindex="4" depressed @click="goToSignup">Go to signup</v-btn>
              </v-card-actions>
            </v-row>

          </v-card>
        </v-form>
          </v-col>
        </v-row>

       
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
      username : "",
      password : "",
      alert: false,
      alertMessage: ''
    }
  },
  methods: {
   login: function() {
     let username = this.username;
     let password = this.password;
     this.$store.dispatch('auth/login',
      {
        'username': username,
        'password': password
      })
      .then(() => {
        this.$router.push('/');
      })
      .catch(err => {
        this.alertMessage = err.response.data.message;
        this.alert = true;
      })
    },
    goToSignup: function() {
      this.$router.push({ name: 'signup', params: { mode: 'connect' } });
    },
    goToPasswordReset: function() {
      this.$router.push({ name: 'forgotPassword' });
    }
  }
}

</script>
<style scoped>

.intro-container {
  color: #ECEFF1;
}

.custom-list-item {
  list-style-type: none;

}

.intro-text {
  line-height: 1.9rem !important;

}

.full-height-login {
  height: 97vh;
}
</style>