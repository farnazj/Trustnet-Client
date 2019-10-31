import store from '../store/store'

//function to sort sources by full name or username (for news publishing entities)
function compareNames(a, b) {

  let sourceNames = []
  Array.from(arguments).forEach(source => sourceNames.push(
    source.systemMade
    ? source.userName
    : source.firstName.toLowerCase() + ' ' + source.lastName.toLowerCase())
  );

  return sourceNames[0].localeCompare(sourceNames[1]);
}

function compare2Sources(aId, bId) {

  let authUserId = store.getters['auth/user'].id;

  if (aId == authUserId)
    return -1;
  else if (bId == authUserId)
    return 1;
  else {
    let trustedIds = store.getters['relatedSources/trustedIds'];
    let followedIds = store.getters['relatedSources/followedIds'];

    if (trustedIds.includes(aId) && trustedIds.includes(bId)) {
      if (followedIds.includes(aId))
        return -1;
      else if (followedIds.includes(bId))
        return 1;
      else
        return -1
    }
    else if (trustedIds.includes(aId))
      return -1;
    else if (trustedIds.includes(bId))
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
      let aCredVal = Math.abs(a.lastVersion.postCredibility);
      let bCredVal = Math.abs(b.lastVersion.postCredibility);

      if ( (aCredVal == 0 && bCredVal != 0) || (aCredVal > bCredVal) )
        return -1;
      else if ( (aCredVal != 0 && bCredVal == 0) || (aCredVal < bCredVal) )
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
    let aDate = new Date(a.updatedAt);
    let bDate = new Date(b.updatedAt);
    if (aDate < bDate)
      return -1;
    else if (aDate > bDate)
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
    let aDate = new Date(a.updatedAt);
    let bDate = new Date(b.updatedAt);
    if (aDate < bDate)
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

  let trustedIds = store.getters['relatedSources/trustedIds'];

  if (trustedIds.includes(source.id))
    return true;
  else
    return false;
}

function isFollowed(source) {

 let followedIds = store.getters['relatedSources/followedIds'];

 if (followedIds.includes(source.id))
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
