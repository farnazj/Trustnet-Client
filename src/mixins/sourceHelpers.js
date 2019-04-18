import utils from '@/services/utils'

export default {
  data: () => {
    return {
    }
  },
  methods: {
    sourceDisplayName: function(source) {
        return source.systemMade ? source.userName : source.firstName + ' ' + source.lastName;
    }
  },
  computed: {
    isTrusted: function() {
      return utils.isTrusted(this.source);
    },
    isFollowed: function() {
      return utils.isFollowed(this.source);
    }
  }

}
