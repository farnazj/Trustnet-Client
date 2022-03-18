import utils from '@/services/utils'

export default {
  data: () => {
    return {
      search: '',
      displayedSourceFilters: ['media', 'users'],
      individualFilterHeader: null,
      sourceResults: [],
      limit: 50,
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
          let retreivedData = results.data;
          retreivedData.sort(utils.compareSources);
          this.sourceResults.push(...retreivedData);
          
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
    },
    displayedSourceFilters: function(newArr) {
      if (newArr.length != 1) //2 or 0
        this.individualFilterHeader = null;
      else {
        if (newArr.includes('users'))
          this.individualFilterHeader = 'true';
        else
          this.individualFilterHeader = 'false';
      }

      this.initiateSearch();
    }
  }
}
