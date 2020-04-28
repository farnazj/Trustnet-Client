import utils from '@/services/utils'

export default {
  data: () => {
    return {
    }
  },
  methods: {
    sourceDisplayName: function(source) {
        return source.systemMade ? source.userName : source.firstName + ' ' + source.lastName;
    },
    sourceIsNonEmpty: function(source) {
        return Object.keys(this.user).length > 0;
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
