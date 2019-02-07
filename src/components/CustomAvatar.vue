<template>

    <v-avatar color="teal" v-on:click="goToPage">

      <img v-if="user.photo" v-bind:src="user.photo">
      <span v-else-if="user.firstName" class="white--text"> {{getInitials}}</span>
      <span v-else class="white--text"> {{getCroppedUserName}} </span>

    </v-avatar>

</template>

<script>

export default {
  props: {
    user: { type: Object }
  },
  data () {
    return {
      //
    }
  },
  created() {
    //build the href for avatar
    //replace the text in span inside the avatar
  },
  computed: {
    getInitials: function() {
      return (this.user.firstName.charAt(0) + this.user.lastName.charAt(0)).toUpperCase();
    },
    getCroppedUserName: function() {
      console.log("user", this.user)
      return this.user.userName.substring(0,3);
    }
  },
  methods: {
    goToPage: function(event) {

    }
  },
  directives: {
    'rainbow': {
      bind(el, binding, vnode) {
        //el.style.color =
      }
    }
  }
}
</script>
