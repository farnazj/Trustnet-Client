<template>

  <v-avatar color="blue darken-1" :size="getSize">

    <img v-if="user.photo" :src="user.photo">
    <span v-else-if="user.firstName" class="white--text"> {{getInitials}}</span>
    <span v-else class="white--text"> {{getCroppedUserName}} </span>

  </v-avatar>

</template>

<script>
import utils from '@/services/utils'

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
      defaultSize: 40
    }
  },
  computed: {
    getInitials: function() {
      return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase();
    },
    getCroppedUserName: function() {
      return this.user.userName.substring(0,3);
    },
    getSize: function() {
      return this.size ? this.size : this.defaultSize;
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
