<template>

  <v-row v-if="tags" :class="{'one-liner': compact}" no-gutters>
    <v-col cols="12">
      <v-chip v-for="tag in tags" :key="tag.id" class="mr-2 mt-1 chip-custom" label
        color="lime lighten-4">
         {{tag.text}}
      </v-chip>
    </v-col>
  </v-row>

</template>

<script>

export default {
  props: {
    tags: {
      type: Array,
      required: true
    },
    compact: {
      type: Boolean
    }
  },
  data: () => {
    return {

    }
  },
  computed: {

  }

}
</script>

<style scoped>
  .one-liner {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  .custom-chip {

  }
</style>
