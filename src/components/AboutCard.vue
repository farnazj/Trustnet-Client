<template>

  <v-col cols="12" class="card-container mb-5">

    <v-row no-gutters>

      <v-col cols="1">
        <v-card height="60px" :color="typeColorMapping[categoryType]"
          class="pa-2 categorizer">
          <v-row align="center" no-gutters class="parent-height" justify="center">
            <span class="caption">
              <slot name="category">
              </slot>
            </span>
          </v-row>
        </v-card>
      </v-col>

      <v-col>
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
    }
  },
  data(){
    return {
      typeColorMapping: {
        'general': 'indigo lighten-4',
        'sources': 'blue lighten-4',
        'home': 'orange lighten-4'
      }
    }
  }
}
</script>

<style scoped>
.categorizer {
  border-radius: 0 30% 30% 0;
}

.card-container {
  display: inline-flex;
}
</style>
