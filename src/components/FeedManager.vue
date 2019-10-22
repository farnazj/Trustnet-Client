<template>
  <v-container fluid>
  <v-row>
    <v-col sm="6" offset-sm2 cols="10">
      <p>
        Add an RSS feed to the system so that you and other users can hear
        about its latest content.
      </p>

      <v-alert v-model="alert" :type="type">
        {{alertMessage}}
      </v-alert>

      <v-form ref="feedMenu">
        <v-card>
          <v-container fluid>

          <v-row class="mb-4">
            <v-text-field v-model="feed" tabindex="1"
              label="Feed URL" required :rules="formRules.feedURLRules">
            </v-text-field>
          </v-row>

          <v-row>
            <v-col cols="12" d-flex>
              <v-select :items="frequencySelects" label="How frequently does the feed publish new content?"
                outlined v-model="frequency" item-text="label" item-value="value" required
                :rules="formRules.frequencyRules"></v-select>
            </v-col>
          </v-row>

          <v-row justify-center>
            <v-card-actions >
              <v-btn depressed color="primary" @click="submit">Submit</v-btn>
            </v-card-actions>
          </v-row>

        </v-container>
        </v-card>
      </v-form>

    </v-col>
  </v-row>
  </v-container>
</template>

<script>
import feedServices from '@/services/feedServices'

export default {
  components: {
  },
  data () {
    return {
      type: 'info',
      alert: false,
      alertMessage: '',
      frequency: null,
      feed: null,
      frequencySelects: [
        {
          label: 'A few times per hour',
          value: 1,
        },
        {
          label: 'A few times per day',
          value: 2,
        },
        {
          label: 'A few times per week',
          value: 3,
        },
        {
          label: 'Less frequently than above',
          value: 4,
        }
      ],
      formRules: {
        feedURLRules: [
          v => !!v || 'Feed URL is required'
        ],
        frequencyRules: [
          v => !!v || 'Select a frequency'
        ]
      }
    }
  },
  methods: {
    submit: function() {
      if (this.$refs.feedMenu.validate()) {
        let reqBody = {
          rssfeed: this.feed,
          frequency: this.frequency
        }

        this.$emit('loading-on');

        feedServices.postFeed(reqBody)
        .then(response => {
          this.type = 'info';
          this.alertMessage = response.data.message;
          this.alert = true;
        })
        .catch(err => {
          this.alertMessage = err.response.data.message;
          this.type = 'error';
          this.alert = true;
        })
        .finally(() => {
          this.$emit('loading-off')
        })
      }
    }
  }

}

</script>
