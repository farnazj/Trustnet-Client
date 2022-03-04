<template>

  <v-avatar color="blue-grey darken-3" :size="getSize">
    <v-img v-if="user.photoUrl" contain :src="extendedPhotoUrl"> </v-img>
    <span v-else class="blue-grey--text text--lighten-5 source-initials"> {{getInitials}}</span>
    <!-- <span v-else class="white--text"> {{getCroppedUserName}} </span> -->
  </v-avatar>

</template>

<script>
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
        if (!this.user.systemMade) {
          return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase();
        }
        else {
          if (this.user.email)
            return this.user.email.charAt(0);
          else {
            let croppedArr = this.user.userName.replace('The', '').trim().split(' ');
            let inits = croppedArr.map(el => el.charAt(0).toUpperCase());
            return inits.join('');
          }
          
        }
      }
      else
        return '';
    },
    getCroppedUserName: function() {
      return this.user.userName.substring(0,3);
    },
    getSize: function() {
      return this.size ? this.size : this.defaultSize;
    },
    getTextSize: function() {
      return (16 / 30) * this.getSize;
    },
    extendedPhotoUrl: function() {
      if (this.user.photoUrl.includes('http'))
        return this.user.photoUrl;
      else
        return consts.BASE_URL + '/' + this.user.photoUrl;
    }
  }

}
</script>

<style scoped>
.source-initials {
	max-width: 100%;
	overflow: hidden;
}
</style>
