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
       <v-tooltip bottom max-width="600" open-delay="700">
         <template v-slot:activator="{ on }">
           <v-switch v-on="on" dense :color="anonymous ? 'blue lighten-1' : ''"
            v-model="anonymous" :label="anonymousSwitchLabel"
          ></v-switch>
         </template>
         <span> Your question will be surfaced to the sources you follow or trust even though they may not follow
           or trust you. Choose if you want your name to be visible with your question.
           Note that those who follow or trust you will see your name along with your question regardless.</span>
       </v-tooltip>
        <source-selector ref="arbiters" class ="mt-2" population="upstream">
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
    'assessmentId',
    'rerenderKey'
  ],
  data () {
    return {
      credibility: null,
      anonymous: true,
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
    console.log('in created')
    this.mapCredProperties();
  },
  computed: {
    textAreaLabel: function() {
      if (this.credibility == this.credibilitySelectMapping(consts.VALIDITY_CODES.QUESTIONED))
        return 'Elaborate on your question';
      else
        return 'Provide your reasoning';
    },
    anonymousSwitchLabel: function() {
      if (this.anonymous)
        return 'Pose question anonymously';
      else
        return 'Reveal my name'
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
      this.anonymous = true;
      this.mapCredProperties();
    },
    postCredibility: function(val) {
      this.mapCredProperties();
    },
    rerenderKey: function(val) {
      this.mapCredProperties();
    }
  }

}

</script>
