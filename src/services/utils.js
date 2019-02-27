export default {

  //function to sort sources by full name or username if they don't have full name
  compareSources: function(a, b) {
    let source_names = []
    Array.from(arguments).forEach(source => source_names.push(source.systemMade ? source.userName :
      source.firstName.toLowerCase() + ' ' + source.lastName.toLowerCase()));

    return source_names[0].localeCompare(source_names[1]);
  }

}
