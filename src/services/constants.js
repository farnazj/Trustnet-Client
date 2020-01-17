//const baseURL = `http://localhost:3000`;
const baseURL = `http://developer.trustnet.csail.mit.edu`
const VALIDITY_CODES = {'CONFIRMED': 1, 'REFUTED': -1, 'QUESTIONED': 0};
const FBCommentsBaseURL = `http://trustnet.csail.mit.edu/test`;
const FB_APP_ID = `1910706082368253`;
const STRINGIFIED_ARR_SEP = '^,';

export default {
  baseURL,
  VALIDITY_CODES,
  FBCommentsBaseURL,
  FB_APP_ID,
  STRINGIFIED_ARR_SEP
}
