var moment = require('moment')

export default {
  data: () => {
    return {
    }
  },
  methods: {
    timeElapsed: function(time) {
      return moment(time).startOf('minute').fromNow();
    }
  }
}
