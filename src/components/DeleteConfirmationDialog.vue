<template>
  <v-dialog v-model="visible" max-width="500px">
    <v-card>
     <v-card-title class="headline">
     </v-card-title>

     <v-card-text class="body-1 grey--text text--darken-3">
       Are you sure you want to delete this {{itemType}}?
     </v-card-text>

     <v-card-actions>
       <v-spacer></v-spacer>

       <v-btn color="primary" text @click="cancel">
         Cancel
       </v-btn>

       <v-btn color="red darken-1" text @click="confirm">
         Delete
       </v-btn>

     </v-card-actions>
   </v-card>
  </v-dialog>

</template>

<script>
export default {
  props: [
    'showDialog',
    'itemType'
  ],
  data: () => {
    return {
    }
  },
  computed: {
    visible: {
      get: function() {
        return this.showDialog;
      },
      set: function(newValue) {
        this.$emit('close');
      }
    }
  },
  methods: {
    cancel: function() {
      this.$emit('close');
    },
    confirm: function() {
      this.$emit('confirm');
    }
  }
}
</script>
