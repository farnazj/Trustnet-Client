import store from '../store/store'

//function to sort sources by full name or username if they don't have full name
function compareNames(a, b) {
  let source_names = []
  Array.from(arguments).forEach(source => source_names.push(source.systemMade ? source.userName :
    source.firstName.toLowerCase() + ' ' + source.lastName.toLowerCase()));

  return source_names[0].localeCompare(source_names[1]);
}

function compare2Sources(a_id, b_id) {

  let auth_userid = store.getters['auth/user'].id;

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
      return 0;
  }

}


function compareAssessments(a, b) {
  if (!a.lastVersion.isTransitive && b.lastVersion.isTransitive)
    return -1;
  else if (a.lastVersion.isTransitive && !b.lastVersion.isTransitive)
    return 1;
  else {
    let compareVal = compare2Sources(a.assessor.SourceId, b.assessor.SourceId);
    if (compareVal != 0)
      return compareVal;
    else {
      let a_credVal = Math.abs(a.lastVersion.postCredibility);
      let b_credVal = Math.abs(b.lastVersion.postCredibility);

      if ( (a_credVal == 0 && b_credVal != 0) || (a_credVal > b_credVal) )
        return -1;
      else if ( (a_credVal != 0 && b_credVal == 0) || (a_credVal < b_credVal) )
        return 1;
      else
        return compareNames(a.assessor, b.assessor);
    }
  }

}


function compareSources(a, b) {
  let compareVal = compare2Sources(a.id, b.id);
  if (compareVal != 0)
    return compareVal;
  else
    return compareNames(a, b);

}

function compareBoosters(a, b) {
  let compareVal = compare2Sources(a.booster.id, b.booster.id);
  if (compareVal != 0)
    return compareVal;
  else
  {
    let a_date = new Date(a.updatedAt);
    let b_date = new Date(b.updatedAt);
    if (a < b)
      return -1;
    else if (a > b)
      return 1;
    else
      return compareNames(a.booster, b.booster);
  }
}

function compareTitles(a, b) {
  let compareVal = compare2Sources(a.author.id, b.author.id);
  if (compareVal != 0)
    return compareVal;
  else {
    let a_date = new Date(a.updatedAt);
    let b_date = new Date(b.updatedAt);
    if (a < b)
      return -1;
    else if (a > b)
      return 1;
    else
      return compareNames(a.author, b.author);
  }
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
  compareTitles,
  compareAssessments,
  getUnique,
  isTrusted,
  isFollowed
}
