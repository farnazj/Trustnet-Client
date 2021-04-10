<template>

  <v-dialog v-model="loading"
    hide-overlay persistent width="300">
    <v-card color="lime lighten-1" dark>
      <v-card-text>
        <slot>
          Loading
        </slot>
        <v-progress-linear indeterminate color="white"
        class="mb-0 mt-1">
        </v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState('loader', [
      'loading'
    ])
  }

}
</script>

