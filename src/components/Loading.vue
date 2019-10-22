<template>

  <v-dialog v-model="loading"
    hide-overlay persistent width="300">
    <v-card color="primary" dark>
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

<!-- <template>
  <v-dialog v-model="loading"
    hide-overlay persistent width="300" content-class="centered-dialog">
        <v-layout justify-center>
        <orbit-spinner :animation-duration="1200" :size="55" color="primary"/>
        <h1 v-if="message != null">{{message}}</h1>
    </v-layout>
  </v-dialog>
</template>

<script>
import { OrbitSpinner } from 'epic-spinners'
import { mapState } from 'vuex';

export default {
  name: "Loading",
  components: {
    OrbitSpinner
  },
  data: function() {
    return {}
  },
  props: {
    message: {
      type: String,
      default: "Loading..."
    },
    progressColor: {
      type: String,
      default: '#FFFFFF'
    },
  },
  computed: {
    ...mapState('loader', [
      'loading'
    ])
  },
}
</script>

<style>
.dialog.centered-dialog {
  background: #282c2dad;
  box-shadow: none;
  border-radius: 6px;
  width: auto;
  color: whitesmoke;
}
</style> -->
