<template>

  <v-avatar color="blue darken-1" :size="getSize">

    <v-img v-if="user.photoUrl" contain :src="extendedPhotoUrl"> </v-img>
    <span v-else class="white--text"> {{getInitials}}</span>
    <!-- <span v-else class="white--text"> {{getCroppedUserName}} </span> -->

  </v-avatar>

</template>

<script>
import utils from '@/services/utils'
import consts from '@/services/constants'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    size: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      defaultSize: 36
    }
  },
  computed: {
    getInitials: function() {
      if (Object.entries(this.user).length) {
        if (!this.user.systemMade)
          return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase();
        else {
          let cropped_arr = this.user.userName.replace('The', '').trim().split(' ');
          let inits = cropped_arr.map(el => el.charAt(0).toUpperCase());
          return inits.join('');
        }
      }
    },
    getCroppedUserName: function() {
      return this.user.userName.substring(0,3);
    },
    getSize: function() {
      return this.size ? this.size : this.defaultSize;
    },
    extendedPhotoUrl: function() {
      if (this.user.photoUrl.includes('http'))
        return this.user.photoUrl;
      else
        return consts.baseURL + '/' + this.user.photoUrl;
    }
  },
  methods: {
    // goToPage: function(event) {
    //   console.log(this.user)
    //   this.$router.push({ name: 'profile', params: { username: this.user.userName } });
    // },
  }

}
</script>
