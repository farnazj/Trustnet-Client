<template>
  <div :key="assessment.id" class="pa-1">

    <v-layout row class="mb-2">
      <v-flex xs12>
        <custom-avatar :user="assessment.assessor" :clickEnabled="true"></custom-avatar>
        <span class="ml-2 caption grey--text text--darken-3"> {{timeElapsed(assessment.updatedAt)}} </span>
        <span v-if="assessment.version > 1" class="ml-2 caption grey--text text--darken-1">
          Edited</span>
      </v-flex>
    </v-layout>

    <v-layout row v-if="assessment.body">
      <v-flex xs12>
        <p v-if="!showFullText && bodyWordCount > 10">{{truncatedText}}
          <span class="blue--text text--darken-3 body-2 cursor-pointer" @click="showFullText = true">
            show more
          </span>
        </p>
        <p v-else>{{assessment.body}}
          <span v-if="bodyWordCount > 10" class="blue--text text--darken-3 body-2 cursor-pointer"
             @click="showFullText = false">
            show less
          </span>
        </p>

      </v-flex>
    </v-layout>

    <v-divider></v-divider>
  </div>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import timeHelpers from '@/mixins/timeHelpers'

export default {
  components: {
   'custom-avatar': customAvatar
  },
  props: {
    assessment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showFullText: false
    }
  },
  computed: {
    truncatedText: function() {
      return this.assessment.body.split(' ').slice(0, 10).join(' ') + '...';
    },
    bodyWordCount: function() {
      return this.assessment.body.split(' ').length;
    }
  },
  mixins: [timeHelpers]
}

</script>
