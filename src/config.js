//const BASE_URL = "http://localhost:8080"; // 기본 API URL
const BASE_URL = "https://dkcq9z3tgnp6t.cloudfront.net";

const config = {
  API_URL: BASE_URL,

  AUTH: {
    SIGNUP: `${BASE_URL}/api/auth/signup`,
    REISSUE: `${BASE_URL}/api/auth/reissue`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GUEST_SESSION: `${BASE_URL}/api/auth/guest-session`,
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

  FLIGHT:{
    GET: `${BASE_URL}/api/focus/flights`,
  },

};
export default config;
