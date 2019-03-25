import store from '../store/store'

function compareSourceIds(a, b) {

  let auth_userid = store.getters['auth/user'].id;

  if (a == auth_userid)
    return -1;
  else if (b == auth_userid)
    return 1;
  else {
    let trusted_ids = store.getters['relatedSources/trustedIds'];
    if (trusted_ids.includes(a))
      return -1;
    else if (trusted_ids.includes(b))
      return 1;
  }
  return -1;

}

export default {

  //function to sort sources by full name or username if they don't have full name
  compareSources: function(a, b) {
    let source_names = []
    Array.from(arguments).forEach(source => source_names.push(source.systemMade ? source.userName :
      source.firstName.toLowerCase() + ' ' + source.lastName.toLowerCase()));

    return source_names[0].localeCompare(source_names[1]);
  },
  compareAssessments: function(a, b) {
    return compareSourceIds(a.SourceId, b.SourceId)
  },
  compareBoosters: function(a, b) {
    return compareSourceIds(a.id, b.id)
  },
  getUnique: function(arr, comp) {

    const unique = arr.map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e]).map(e => arr[e]);

   return unique;
 },
 isTrusted: function(source) {

    let trusted_ids = store.getters['relatedSources/trustedIds'];

    if (trusted_ids.includes(source.id))
      return true;
    else
      return false;
 },
 isFollowed: function(source) {
   let followed_ids = store.getters['relatedSources/followedIds'];

   if (followed_ids.includes(source.id))
     return true;
   else
     return false;
 }

}
