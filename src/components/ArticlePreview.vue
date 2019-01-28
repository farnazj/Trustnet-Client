<template>
  <v-container>
    <v-flex xs4>
      <v-card dark color="secondary">
          <v-card-text class="px-0">*</v-card-text>
        </v-card>
    </v-flex>

    <v-flex xs6>
      <v-card dark color="secondary">
          <v-card-text class="px-0">*</v-card-text>
        </v-card>
    </v-flex>

    <v-flex xs2>
      <v-card dark color="secondary">
          <v-card-text class="px-0">*</v-card-text>
        </v-card>
    </v-flex>

  </v-container>
</template>

<script>

  export default {
    props: ['post'],
    data: () => {
      return {
        articles: [{},
        {}]
      }
  },
  created() {
  }
}
</script>

<style>

</style>
