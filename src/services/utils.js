import store from '../store/store'

//function to sort sources by full name or username if they don't have full name
function compareNames(a, b) {
  let source_names = []
  Array.from(arguments).forEach(source => source_names.push(source.systemMade ? source.userName :
    source.firstName.toLowerCase() + ' ' + source.lastName.toLowerCase()));

  return source_names[0].localeCompare(source_names[1]);
}

function compare2Sources(a, b, id_key) {

  let auth_userid = store.getters['auth/user'].id;
  let a_id = a[id_key];
  let b_id = b[id_key];

  if (a_id == auth_userid)
    return -1;
  else if (b_id == auth_userid)
    return 1;
  else {
    let trusted_ids = store.getters['relatedSources/trustedIds'];
    let followed_ids = store.getters['relatedSources/followedIds'];
    if (trusted_ids.includes(a_id) && trusted_ids.includes(b_id)) {
      if (followed_ids.includes(a_id))
        return -1;
      else if (followed_ids.includes(b_id))
        return 1;
      else
        return -1
    }
    else if (trusted_ids.includes(a_id))
      return -1;
    else if (trusted_ids.includes(b_id))
      return 1;
    else
      compareNames(a, b);
  }

}


function compareAssessments(a, b) {
  if (!a.lastVersion.isTransitive && b.lastVersion.isTransitive)
    return -1;
  else if (a.lastVersion.isTransitive && !b.lastVersion.isTransitive)
    return 1;
  else
    return compare2Sources(a.assessor, b.assessor, 'SourceId');
}


function compareSources(a, b) {
  return compare2Sources(a, b, 'id')
}

function compareBoosters(a, b) {
  return compare2Sources(a.booster, b.booster, 'id');
}

function getUnique(arr, comp) {
  const unique = arr.map(e => e[comp])
  .map((e, i, final) => final.indexOf(e) === i && i)
  .filter(e => arr[e]).map(e => arr[e]);

 return unique;
}

function isTrusted(source) {

  let trusted_ids = store.getters['relatedSources/trustedIds'];

  if (trusted_ids.includes(source.id))
    return true;
  else
    return false;
}

function isFollowed(source) {
 let followed_ids = store.getters['relatedSources/followedIds'];

 if (followed_ids.includes(source.id))
   return true;
 else
   return false;
}

export default {
  compareNames,
  compareSources,
  compareBoosters,
  compareAssessments,
  getUnique,
  isTrusted,
  isFollowed
}
