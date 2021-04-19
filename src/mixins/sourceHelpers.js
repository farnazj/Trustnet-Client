import utils from '@/services/utils'

export default {
  data: () => {
    return {
    }
  },
  methods: {
    /*
    for accounts managed by individuals: full name (registered users) or email (external users)
    for rss feeds: username
    */
    sourceDisplayName: function(source) {
      return source.systemMade ? (source.isVerified ? source.userName : source.email ) : 
        source.firstName + ' ' + source.lastName;
    },
    sourceIsNonEmpty: function(source) {
        return Object.keys(this.user).length > 0;
    },
    /*
    only for accounts belonging to individual users
    */
    sourceShortName: function(source) {
      return source.isVerified ? source.userName : source.email;
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
