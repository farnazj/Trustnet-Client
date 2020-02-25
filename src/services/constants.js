//const BASE_URL = `http://localhost:3000`;
const BASE_URL = `http://developer.trustnet.csail.mit.edu`
const FB_COMMENTS_BASE_URL= `http://trustnet.csail.mit.edu/test`;
const FB_APP_ID = `1910706082368253`;

const SITE_NAME = 'Trustnet';

const CRED_SOURCES_REQ_MAPPING = { 'Followed': 'followed', 'Me': 'me',
'Trusted': 'trusted', 'Selected Sources': 'specified' };

const VALIDITY_REQ_MAPPING = { All: 'all', Confirmed: 'confirmed', Refuted: 'refuted',
  Debated: 'debated', Questioned: 'questioned' };

const SEEN_STATUS_REQ_MAPPING = { 'Seen': 'seen', 'Not Seen': 'not seen' };
const VALIDITY_CODES = {'CONFIRMED': 1, 'REFUTED': -1, 'QUESTIONED': 0};

const STRINGIFIED_ARR_SEP = '^,';

export default {
  BASE_URL,
  FB_COMMENTS_BASE_URL,
  FB_APP_ID,
  SITE_NAME,
  CRED_SOURCES_REQ_MAPPING,
  VALIDITY_REQ_MAPPING,
  SEEN_STATUS_REQ_MAPPING,
  VALIDITY_CODES,
  STRINGIFIED_ARR_SEP
}
