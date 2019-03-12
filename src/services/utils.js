import store from '../store/store'

export default {

  //function to sort sources by full name or username if they don't have full name
  compareSources: function(a, b) {
    let source_names = []
    Array.from(arguments).forEach(source => source_names.push(source.systemMade ? source.userName :
      source.firstName.toLowerCase() + ' ' + source.lastName.toLowerCase()));

    return source_names[0].localeCompare(source_names[1]);
  },
  getUnique: function(arr, comp) {

    const unique = arr.map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e]).map(e => arr[e]);

   return unique;
 },
 isTrusted: async function(source) {
    if (!store.state.relatedSources.trusted_sources.length)
      await store.dispatch('relatedSources/fetchTrusteds');

    let trusted_ids = store.state.relatedSources.trusted_sources.map(source => source.id);

    if (trusted_ids.includes(source.id))
      return true;
    else
      return false;
 }

}
