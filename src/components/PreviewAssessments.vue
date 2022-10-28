<template>
    <div class="assessment-preview-container">
        <v-tooltip bottom open-delay="600" v-if="assessmentsInCategory.length">
            <template v-slot:activator="{ on }">
            <span class="assessment-type-icon" v-on="on">
                <v-icon small :class="iconMargin">{{iconToDisplay}}</v-icon>
            </span>
            </template>
            <span>{{tooltipText}}</span>
        </v-tooltip>

        <assessor v-for="assessment in uniqueAssessments" :key="assessment.lastVersion.id"
            :user="assessment.assessor" :isTransitive="assessment.lastVersion.isTransitive"
            :credibilityValue="assessment.lastVersion.postCredibility" :class="['mb-2', $vuetify.breakpoint.smAndDown ? 'mr-1' : 'mr-2']">
        </assessor>

        <span v-if="assessmentsInCategory.length > assessmentsOnCardCount" :class="{'mr-2': $vuetify.breakpoint.smAndDown}" >...</span>
    </div>
</template>

<script>
  import assessor from '@/components/Assessor'

  export default {
    components: {
        'assessor': assessor
    },
    props: {
      assessmentType: {
          type: String,
          required: true
      },
      assessmentsInCategory: {
          type: Array,
          required: true
      }
    },
    data: () => {
      return {
       iconToDisplay: '',
       tooltipText: ''
      }
    },
    created() {
     this.setupAssessmentDisplay();
    },
  
    computed: {
        assessmentsOnCardCount: function() {
            if (this.$vuetify.breakpoint.smAndDown)
                return 1;
            else if (this.$vuetify.breakpoint.mdAndDown)
                return 2;
            else 
                return 3;
        },
        iconMargin: function() {
            if (this.$vuetify.breakpoint.smAndDown) {
                return 'mr-1';
            } 
            else {
                if (this.assessmentType == 'confirmed')
                    return 'mr-3';
                else if (this.assessmentType == 'refuted')
                    return 'mr-4';
                else if (this.assessmentType == 'questioned')
                    return 'mr-4';
            } 
                
        },
        uniqueAssessments: function() {
            const origAssessments = this.assessmentsInCategory.slice(0, this.assessmentsOnCardCount);

            const seen = new Set([]);
            const uniques = [];
            for (const assessment of origAssessments) {
                const id = assessment.lastVersion.id;
                if (!seen.has(id)) {
                    seen.add(id);
                    uniques.push(assessment);
                }
            }
            return uniques;
        }
    },
    methods: {
      setupAssessmentDisplay: function() {
           if (this.assessmentType == 'confirmed') {
               this.iconToDisplay = 'fas fa-check';
               this.tooltipText = 'Verified by';
           }
            else if (this.assessmentType == 'refuted') {
                this.iconToDisplay = 'fas fa-times';
                this.tooltipText = 'Refuted by';
            }
            else if (this.assessmentType == 'questioned') {
                this.iconToDisplay = 'fas fa-question';
                this.tooltipText = 'Questioned by';
            }
      }

    },

    watch: {
        assessmentsInCategory: function() {
            this.setupAssessmentDisplay;
        }
    }

}
</script>

<style scoped>
.assessment-type-icon {
    float: left;
}

.assessment-preview-container {
    align-items: center;
    display: inline-flex;
}
</style>
