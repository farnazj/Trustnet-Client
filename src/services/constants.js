//const baseURL = `http://localhost:3000`;
const baseURL = `http://developer.trustnet.csail.mit.edu`
const FBCommentsBaseURL = `http://trustnet.csail.mit.edu/test`;
const FB_APP_ID = `1910706082368253`;

const CRED_SOURCES_REQ_MAPPING = { 'Followed': 'followed', 'Me': 'me',
'Trusted': 'trusted', 'Selected Sources': 'specified' };

const VALIDITY_REQ_MAPPING = { All: 'all', Confirmed: 'confirmed', Refuted: 'refuted',
  Debated: 'debated', Questioned: 'questioned' };

const SEEN_STATUS_REQ_MAPPING = { 'Seen': 'seen', 'Not Seen': 'not seen' };
const VALIDITY_CODES = {'CONFIRMED': 1, 'REFUTED': -1, 'QUESTIONED': 0};

const STRINGIFIED_ARR_SEP = '^,';

export default {
  baseURL,
  FBCommentsBaseURL,
  FB_APP_ID,
  CRED_SOURCES_REQ_MAPPING,
  VALIDITY_REQ_MAPPING,
  SEEN_STATUS_REQ_MAPPING,
  VALIDITY_CODES,
  STRINGIFIED_ARR_SEP
}
