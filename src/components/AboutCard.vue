<template>

  <v-col cols="12" class="card-container mb-5">

    <v-row no-gutters>

      <v-col cols="1">
        <v-card :height="labelHeight" :color="typeColorMapping[categoryType]"
          class="pa-2 categorizer">
          <v-row align="center" no-gutters class="parent-height" justify="center">
            <span class="caption">
              <slot name="category">
              </slot>
            </span>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="11">
        <v-card class="pa-2">
          <v-row no-gutters>
            <v-col cols="3" class="pa-1">
              <span class="title">
                <slot name="title">
                </slot>
              </span>

            </v-col>
            <v-col cols="9">
              <slot name="body">
              </slot>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

  </v-col>

</template>

<script>
export default {
  props: {
    categoryType: {
      type: String
    },
    height: {
      type: String
    }
  },
  data(){
    return {
      typeColorMapping: {
        'general': 'indigo lighten-4',
        'sources': 'blue lighten-4',
        'home': 'orange lighten-4',
        'posts': 'pink lighten-4',

        'settings': 'amber lighten-3',
        'news': 'blue-grey darken-1',
        'twitter': '#1D9BF0',
        'facebook': '#3b5998'
      }
    }
  },
  computed: {
    labelHeight: function() {
      return this.height ? this.height : '60px';
    }
  }
}
</script>

<style scoped>
.categorizer {
  border-radius: 20% 0 0 20%;
}

.card-container {
  display: inline-flex;
}
</style>
