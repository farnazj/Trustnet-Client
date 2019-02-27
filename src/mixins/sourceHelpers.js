
export default {
  data: () => {
    return {
    }
  },
  methods: {
    sourceDisplayName: function(source) {
        return source.systemMade ? source.userName : source.firstName + ' ' + source.lastName;
    }
  }
}
