<template>

<v-fade-transition>
  <v-layout row class="pt-5" id="assessment_container">
    <v-flex xs12>
      <v-card>
      <v-layout row justify-end class="pr-1">
        <v-icon @click="hideContainer">clear</v-icon>
      </v-layout>

      <v-layout row wrap v-if="assessments.questioned.length != 0" class="pa-1">
        <v-flex xs12>
          <v-card-title>
           <div>
             <h4 class="mb-1">Questioned by</h4>
           </div>
         </v-card-title>

          <custom-avatar v-for="item in assessments.questioned"
          :key="item.id" :user="item.assessor" class="mr-1">
          </custom-avatar>

        </v-flex>
      </v-layout>

      <v-layout row class="border-top">
        <v-flex v-for="(key,index) in ['confirmed', 'refuted']" :key="index"
        :xs6="isDebated" :xs12="!isDebated" v-if="assessments[key].length != 0"
        class="assessment-col">

            <v-card-title>
             <div>
               <h4 class="mb-1" v-if="key == 'confirmed'"> Verifications</h4>
               <h4 class="mb-1" v-else-if="key == 'refuted'"> Refutations</h4>
             </div>
           </v-card-title>
           <v-divider ></v-divider>


            <template v-for="(assessment, index) in assessments[key]" >
              <div :key="assessment.id" class="pa-1">

                <v-layout row class="mb-2">
                  <v-flex xs12>
                    <custom-avatar :user="assessment.assessor"></custom-avatar>
                    <span class="ml-2"> {{timeElapsed(assessment.updatedAt)}} </span>
                    <span v-if="assessment.version > 1" class="ml-2 caption grey--text text--darken-1">
                      Edited</span>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <p>{{assessment.body}}</p>
                  </v-flex>
                </v-layout>

                <v-divider></v-divider>
              </div>

           </template>

        </v-flex>

      </v-layout>

      </v-card>
    </v-flex>
  </v-layout>
</v-fade-transition>

</template>

<script>
import customAvatar from '@/components/CustomAvatar'
import timeHelpers from '@/mixins/timeHelpers'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
   'custom-avatar': customAvatar
  },
  data () {
    return {
    }
  },
  computed: {

    isDebated: function () {
      return this.assessments.confirmed.length && this.assessments.refuted.length;
    },
    ...mapState('assessments', [
     'assessments',
     'visible',
   ])
  },
  methods: {

    ...mapActions('assessments', [
      'hideContainer'
    ])
  },
  mixins: [timeHelpers]

}
</script>

<style scoped>
.right-align {
  text-align: right;
}

#assessment_container {
  max-height: 90vh;
}

.assessment-col {
  overflow-y: scroll;
}

.assessment-col:first-child {
  border-right: 1px solid #B0BEC5;
}

.border-top {
  border-top: 1px solid #B0BEC5;
}

</style>
