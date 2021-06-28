<template>
  <v-dialog v-model="visible" max-width="500px">
    <v-form ref="createListForm" lazy-validation>
      <v-card class="pt-1">
        <v-card-text class="body-1 grey--text text--darken-3">
          <v-text-field v-model="listName" label="Name">
          </v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="cancel" small>
            Cancel
          </v-btn>

          <v-btn color="light-blue darken-3" text @click="confirm" small>
            Add List
          </v-btn>

        </v-card-actions>
       </v-card>
     </v-form>
   </v-dialog>
</template>
<script>

export default {
  components: {
  },
  props: [
    'showDialog'
  ],
  data: () => {
    return {
      listName: '',
      nameRules: [
        v => !!v || 'Forgot to write the name?'
      ]
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
      this.$emit('confirm', this.listName);
    },
    resetForm: function() {
      this.$refs.createListForm.reset();
    }
  }
}

</script>
