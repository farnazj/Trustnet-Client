import utils from '@/services/utils'

export default {
  data: () => {
    return {
      search: '',
      sourceResults: [],
      limit: 20,
      offset: 0,
      loadDisabled: false
    }
  },
  methods: {
    initiateSearch: function() {
      this.offset = 0;
      this.loadDisabled = false;
      this.querySources()
      .then(results => {

        this.sourceResults = results.data.sort(utils.compareSources);
        this.offset += results.data.length;

        if (results.data.length < this.limit)
          this.loadDisabled = true;
        else
          this.testRestDataExists();
      })
    },
    loadMore: function() {
      this.querySources()
      .then(results => {
        if (results.data.length) {
          this.sourceResults.push(...results.data);
          this.sourceResults.sort(utils.compareSources);
          this.offset += results.data.length;
        }
        if (results.data.length < this.limit)
          this.loadDisabled = true;
        else
          this.testRestDataExists();

      })
    },
    testRestDataExists: function() {
      this.querySources()
      .then(results => {
        if (!results.data.length) {
          this.loadDisabled = true;
        }
      })
    },
  },
  watch: {
    search () {
      this.initiateSearch();
    }
  }
}
