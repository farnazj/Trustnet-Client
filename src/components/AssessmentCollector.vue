<template>
  <v-container class="pa-0">

    <v-row no-gutters>
      <v-col cols="12">
        <v-select :items="validityStatus" v-model="credibility"
          item-text="label" item-value="value" dense
          label="Article Validity" outline required
          :rules="validityRules.selectRules">

          <template slot="item" slot-scope="data" >
            <div v-html="data.item.label" :class="data.item.color">
            </div>
          </template>

          <template slot="selection" slot-scope="data" >
            <div v-html="data.item.label" :class="data.item.color">
            </div>
          </template>

        </v-select>
      </v-col>
    </v-row>

    <v-row no-gutters class="pt-3">
      <v-col cols="12">
        <v-textarea v-model="assessmentText" :rules="credibility - 2 != 0 ? validityRules.bodyRules : []"
          :label="textAreaLabel">
        </v-textarea>
      </v-col>
    </v-row>

    <v-row no-gutters v-if="credibility == 2">
      <v-col cols="12">
        <source-selector ref="arbiters" class ="mt-2" population="trusteds">
        </source-selector>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import sourceSelector from '@/components/SourceSelector'
import consts from '@/services/constants'

export default {
  components: {
    'source-selector': sourceSelector
  },
  props: ['validityRules',
    'postCredibility',
    'assessmentBody',
    'assessmentId'
  ],
  data () {
    return {
      credibility: null,
      assessmentText: null,
      validityStatus: [
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
  created() {
    this.mapCredProperties();
  },
  computed: {
    textAreaLabel: function() {
      if (this.credibility == this.credibilitySelectMapping(consts.VALIDITY_CODES.QUESTIONED))
        return 'Elaborate on your question';
      else
        return 'Provide your reasoning';
    }
  },
  methods: {
    mapCredProperties: function() {
      this.assessmentText = this.assessmentBody;
      this.credibility = this.credibilitySelectMapping(this.postCredibility);
    } ,
    credibilitySelectMapping: function(credValue) {

      if (credValue < 0)
        return consts.VALIDITY_CODES.REFUTED + 2;
      else if (credValue > 0)
        return consts.VALIDITY_CODES.CONFIRMED + 2;
      else if (credValue == 0)
        return consts.VALIDITY_CODES.QUESTIONED + 2;
    }
  },
  watch: {
    assessmentId: function() {
      this.mapCredProperties();
    },
    postCredibility: function() {
      this.mapCredProperties();
    },
    crediblity: function(val) {
      console.log('new cred val is ', val)
    }
  }

}

</script>
