<template>

    <v-bottom-sheet inset v-model="statsSheetVisibleModel" >
        <v-sheet class="text-center" height="60px" color="lime lighten-4">
            <div class="py-3">
                <p class="body-2">You have shared {{recentShareCount}} and assessed {{recentAssessmentCount}} post(s) in the past 24 hours.</p>
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
                'recentAssessmentCount'
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
