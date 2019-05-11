<template>
  <v-container class="pa-0">

    <v-layout row>

      <v-flex xs12>
        <v-select :items="validity_status" v-model="credibility"
          item-text="label" item-value="value"
          label="Article Validity" outline required
          :rules="validityRules">

          <template slot="item" slot-scope="data" >
            <div v-html="data.item.label" :class="data.item.color">
            </div>
          </template>

          <template slot="selection" slot-scope="data" >
            <div v-html="data.item.label" :class="data.item.color">
            </div>
          </template>

        </v-select>

      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-textarea v-model="assessmentText"
          label="Provide your reasoning(?)">
        </v-textarea>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import consts from '@/services/constants'

export default {
  props: ['validityRules',
    'postCredibility',
    'assessmentBody',
    'assessmentId'
  ],
  data () {
    return {
      credibility: null,
      assessmentText: null,
      validity_status : [
        {
          label: 'This article is accurate',
          value: consts.VALIDITY_CODES.CONFIRMED + 2,
          color: 'green--text text--darken-2'
        },
        {
          label: 'This article is inaccurate',
          value: consts.VALIDITY_CODES.REFUTED + 2,
          color: 'red--text text--accent-3'
        },
        {
          label: 'I want to know about the validity of this article',
          value: consts.VALIDITY_CODES.QUESTIONED + 2,
          color: 'amber--text text--darken-3'
        }
      ]
    }
  },
  watch: {
    assessmentId: function() {
      this.assessmentText = this.assessmentBody;
      this.credibility = this.postCredibility;
    },
    postCredibility: function() {
      this.assessmentText = this.assessmentBody;
      this.credibility = this.postCredibility;
    }
  }

}

</script>
