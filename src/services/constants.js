//const baseURL = `http://localhost:3000`;
const baseURL = `http://developer.trustnet.csail.mit.edu`
const VALIDITY_CODES = {'CONFIRMED': 1, 'REFUTED': -1, 'QUESTIONED': 0};
const FBCommentsBaseURL = `http://trustnet.csail.mit.edu/test`;

export default {
  baseURL,
  VALIDITY_CODES,
  FBCommentsBaseURL
}
