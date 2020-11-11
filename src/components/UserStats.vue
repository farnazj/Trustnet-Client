<template>

    <v-bottom-sheet inset v-model="statsSheetVisibleModel" >
        <v-sheet class="text-center" height="85px" color="lime lighten-4">
            <div class="py-3">
                <p class="body-2">You have shared {{recentShareCount}} and assessed {{recentAssessmentCount}} post(s) in the past 24 hours.</p>
                <p class="body-2">We ask that you share at least {{shareGoalPerDay}} per day for the duration of the user study.</p>
            </div>
        </v-sheet>
    </v-bottom-sheet>
</template>
<script>

import { mapState, mapActions } from 'vuex';

export default {
    data () {
        return {
        }
    },
    computed: {
            statsSheetVisibleModel: {
                get: function() {
                    return this.statsSheetVisible;
                },
                set: function(newValue) {
                    this.setStatsSheetVisibility(newValue);
                }
            },
            ...mapState('userStats', [
                'statsSheetVisible',
                'recentShareCount',
                'recentAssessmentCount',
                'shareGoalPerDay'
            ])
    },
    methods: {
        ...mapActions('userStats', [
            'populateStats',
            'setStatsSheetVisibility'
        ])
    }
}

</script>
