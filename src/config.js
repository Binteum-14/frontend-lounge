//const BASE_URL = "http://localhost:8080"; // 기본 API URL
const BASE_URL = "https://dkcq9z3tgnp6t.cloudfront.net";

const config = {
  API_URL: BASE_URL,

  VISITPASS: {
    GET: `${BASE_URL}/api/visit-passes`,
    POST: `${BASE_URL}/api/visit-passes`,
  },

  RECOMMENDATION: {
    RECOMMENDATIONS: `${BASE_URL}/api/recommendations`,
  },

  AUTH: {
    SIGNUP: `${BASE_URL}/api/auth/signup`,
    REISSUE: `${BASE_URL}/api/auth/reissue`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    CHECK_USERNAME: `${BASE_URL}/api/auth/check-username`,
    WITHDRAW: `${BASE_URL}/api/auth/withdraw`,
  },

  HEALTH: {
    HEALTH: `${BASE_URL}/health`,
  },

  FOCUSRECORD: {
    PASS_GET: `${BASE_URL}/api/focus/pass`,
    PASS_POST: `${BASE_URL}/api/focus/pass`,
  },

  PRODUCT: {
    GET: `${BASE_URL}/api/products`,
    DETAIL_GET: (productID) => `${BASE_URL}/api/products/${productID}`,
  },

  USER: {
    GET: `${BASE_URL}/api/user/me`,
  },
  
  SNACK:{
    GET: `${BASE_URL}/api/focus/snacks`,
    DETAIL_GET: (snackID) => `${BASE_URL}/api/focus/snacks/${snackID}`,
  },

  DIAGNOSIS:{
    POST: `${BASE_URL}/api/diagnosis`,
  },

  FLIGHT:{
    GET: `${BASE_URL}/api/focus/flights`,
  },

  PRESENCE: {
    HEARTBEAT: `${BASE_URL}/api/presence/heartbeat`,
  },

  CHAT: {
    SEND: `${BASE_URL}/api/owner-lounge/chat`,
  },

  AIPACKING:{
    XRAY: (loungeId) => `${BASE_URL}/api/packing/lounge/${loungeId}/xray-preview`,
    CHECK: (loungeId) => `${BASE_URL}/api/packing/lounge/${loungeId}/check`,
    PROFILE: `${BASE_URL}/api/packing/profiles`,
    ITEMS: `${BASE_URL}/api/packing/items`,
  },

};
export default config;
