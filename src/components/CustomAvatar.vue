<template>

    <v-avatar color="cyan darken-2" :size="getSize" @click="goToPage">

      <img v-if="user.photo" :src="user.photo">
      <span v-else-if="user.firstName" class="white--text"> {{getInitials}}</span>
      <span v-else class="white--text"> {{getCroppedUserName}} </span>

    </v-avatar>

</template>

<script>

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
  created() {
    //build the href for avatar
    //replace the text in span inside the avatar
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
