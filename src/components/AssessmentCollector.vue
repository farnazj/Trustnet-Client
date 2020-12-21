<!--
 @fileoverview A component that is used when assessments are requested (e.g., in the ArticleDetails and 
 ContentBooster components)
-->
<template>
  <v-container class="pa-0">

    <v-row no-gutters>
      <v-col cols="12">
        <validation-provider rules="required" v-slot="{ errors }" vid="selectValue">
          <v-select :items="validityStatus" v-model="credibility"
            item-text="label" item-value="value" dense
            label="Article Validity" outline
            >

            <template slot="item" slot-scope="data" >
              <div v-html="data.item.label" :class="data.item.color">
              </div>
            </template>

            <template slot="selection" slot-scope="data" >
              <div v-html="data.item.label" :class="data.item.color">
              </div>
            </template>

          </v-select>
          <span class="caption red--text red--darken-3">{{ errors[0] }}</span>
        </validation-provider>
      </v-col>
    </v-row>

    <v-row no-gutters class="pt-3">
      <v-col cols="12">
        <!-- <v-textarea v-model="assessmentText" :rules="credibility - 2 != 0 ? validityRules.bodyRules : []"
          :label="textAreaLabel"> -->
          <validation-provider :rules="{ reasoningRule: { selectValue: '@selectValue', username: user.userName } }" v-slot="{ errors }">
              <v-textarea v-model="assessmentText"
              :label="textAreaLabel">
            </v-textarea>
          <span class="caption red--text red--darken-3">{{ errors[0] }}</span>
        </validation-provider>

      </v-col>
    </v-row>

    <v-row no-gutters v-if="credibility == 2">
      <v-col cols="12">
       <v-tooltip bottom max-width="600" open-delay="700">
         <template v-slot:activator="{ on }">
           <v-switch v-on="on" dense :color="anonymous ? 'blue lighten-1' : ''"
            v-model="anonymous" label="Pose question anonymously"
          ></v-switch>
         </template>
         <span> Your question will be surfaced to the sources you follow or trust even though they may not follow
           or trust you. Choose if you want your name to be visible with your question.
           Note that those who follow or trust you will see your name along with your question regardless.</span>
       </v-tooltip>
       <v-row no-gutters class="caption grey--text text--darken-2">{{anonymousSwitchLabel}}</v-row>
        <source-selector ref="arbiters" class ="mt-2" population="upstream">
        </source-selector>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import sourceSelector from '@/components/SourceSelector'
import consts from '@/services/constants'
import { ValidationProvider } from 'vee-validate';
import { mapGetters } from 'vuex'

export default {
  components: {
    'source-selector': sourceSelector,
    ValidationProvider
  },
  props: [
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
      /*
      consts.VALIDITY_CODES.QUESTIONED has a value of 0 and therefore would be interpreted as false by
      the select component. To counteract this, the validity values (-1, 0, 1) are mapped to (1, 2, 3).
      The parent component that uses the AssessmentCollector needs to subtract 2 from the selected value.
      */
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
      ],
      validityRules: {
          selectRules: [
            v => !!v || 'Assess the accuracy of the article'
          ],
          bodyRules: [
            v => !!v || 'You should add your reasoning'
          ]
        }
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
    },
    anonymousSwitchLabel: function() {
      if (this.anonymous)
        return 'Your name will be hidden from others.';
      else
        return 'Your name will be revealed.'
    },
    ...mapGetters('auth', [
      'user'
    ])
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
