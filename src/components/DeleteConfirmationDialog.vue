<template>
  <v-dialog v-model="isVisible" max-width="500px">
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
      isVisible: false
    }
  },
  created: function(){
    this.isVisible = this.showDialog
  },
  methods: {
    cancel: function() {
      this.isVisible = false;
      this.$emit('close');
    },
    confirm: function() {
      this.isVisible = false;
      this.$emit('confirm');
    }
  },
  watch: {
    showDialog: function(val) {
      this.isVisible = val;
    }
  }
}
</script>
