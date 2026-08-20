import { Cookies } from "react-cookie";
import axios from "axios";
import config from "./config";

const ACCESS_TOKEN_KEY = "accessToken";

const cookies = new Cookies();


/* =========================================
   Axios 인스턴스
========================================= */

const api = axios.create({
  baseURL: config.API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  /*
   * heartbeat에서 받은 guestSessionId 쿠키를
   * 저장하고 이후 API에서도 자동 전송
   */
  withCredentials: true,
});


/* =========================================
   토큰 정리
========================================= */

const normalizeToken = (token) => {
  if (!token) {
    return null;
  }

  let normalizedToken = token;

  if (typeof normalizedToken !== "string") {
    normalizedToken =
      String(normalizedToken);
  }

  normalizedToken =
    normalizedToken.trim();


  /*
   * JSON.stringify 된 토큰 대응
   */
  if (
    normalizedToken.startsWith('"') &&
    normalizedToken.endsWith('"')
  ) {
    try {
      normalizedToken =
        JSON.parse(normalizedToken);
    } catch (error) {
      normalizedToken =
        normalizedToken.slice(
          1,
          -1
        );
    }
  }


  /*
   * 이미 Bearer가 붙어 있으면 제거
   */
  normalizedToken =
    normalizedToken.replace(
      /^Bearer\s+/i,
      ""
    );


  if (
    !normalizedToken ||
    normalizedToken === "undefined" ||
    normalizedToken === "null"
  ) {
    return null;
  }


  return normalizedToken;
};


/* =========================================
   accessToken 가져오기
========================================= */

const getAccessToken = () => {
  const localToken =
    localStorage.getItem(
      ACCESS_TOKEN_KEY
    );

  const cookieToken =
    cookies.get(
      ACCESS_TOKEN_KEY
    );


  return normalizeToken(
    localToken ||
    cookieToken
  );
};


/* =========================================
   요청 인터셉터
========================================= */

api.interceptors.request.use(
  (requestConfig) => {
    const token =
      getAccessToken();


    /*
     * skipAuth === true 이면
     * Authorization 절대 보내지 않음
     *
     * 게스트 heartbeat에서 사용
     */
    if (requestConfig.skipAuth) {

      delete requestConfig
        .headers
        .Authorization;

    } else if (token) {

      requestConfig
        .headers
        .Authorization =
        `Bearer ${token}`;

    } else {

      delete requestConfig
        .headers
        .Authorization;
    }


    console.log(
      "------------------------------"
    );

    console.log(
      "요청 method:",
      requestConfig
        .method
        ?.toUpperCase()
    );

    console.log(
      "요청 URL:",
      requestConfig.url
    );

    console.log(
      "skipAuth:",
      !!requestConfig.skipAuth
    );

    console.log(
      "accessToken 존재 여부:",
      !!token
    );

    console.log(
      "Authorization 헤더 존재:",
      !!requestConfig
        .headers
        .Authorization
    );

    console.log(
      "------------------------------"
    );


    return requestConfig;
  },

  (error) => {
    return Promise.reject(error);
  }
);


/* =========================================
   응답 인터셉터
========================================= */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    if (
      error.response?.status === 401
    ) {

      console.error(
        "401 Unauthorized"
      );

      console.error(
        "서버 응답:",
        error.response?.data
      );
    }


    return Promise.reject(
      error
    );
  }
);


/* =========================================
   Content-Type 검사
========================================= */

const validateContentType = (
  response
) => {

  const contentType =
    response.headers[
      "content-type"
    ] || "";


  if (
    !contentType.includes(
      "application/json"
    )
  ) {

    throw new Error(
      "서버 응답이 올바르지 않습니다."
    );
  }
};


/* =========================================
   GET
========================================= */

export const get = async (
  endpoint,
  params = {},
  options = {}
) => {

  const response =
    await api.get(
      endpoint,
      {
        params,
        ...options,
      }
    );


  validateContentType(
    response
  );


  return response.data;
};


/* =========================================
   POST
========================================= */

export const post = async (
  endpoint,
  data = {},
  options = {}
) => {

  const response =
    await api.post(
      endpoint,
      data,
      options
    );


  validateContentType(
    response
  );


  return response.data;
};

/* =========================================
   POST - Blob / SVG 응답
========================================= */

export const postBlob = async (
  endpoint,
  data = {},
  options = {}
) => {

  const response =
    await api.post(
      endpoint,
      data,
      {
        ...options,

        responseType: "blob",
      }
    );

  /*
   * SVG / 이미지 응답이므로
   * validateContentType() 호출하지 않음
   */

  return response.data;
};


/* =========================================
   PUT
========================================= */

export const put = async (
  endpoint,
  data = {},
  options = {}
) => {

  const response =
    await api.put(
      endpoint,
      data,
      options
    );


  validateContentType(
    response
  );


  return response.data;
};


/* =========================================
   DELETE
========================================= */

export const del = async (
  endpoint,
  options = {}
) => {

  const response =
    await api.delete(
      endpoint,
      options
    );


  validateContentType(
    response
  );


  return response.data;
};


/* =========================================
   PATCH - 이미지 업로드
========================================= */

export const patch = async (
  endpoint,
  imageFile,
  options = {}
) => {

  const formData =
    new FormData();


  formData.append(
    "file",
    imageFile
  );


  const response =
    await api.patch(
      endpoint,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },

        ...options,
      }
    );


  validateContentType(
    response
  );


  return response.data;
};


/* =========================================
   POST - 이미지 + JSON
========================================= */

export const uploadImageWithJson =
  async (
    endpoint,
    imageFile,
    jsonData,
    options = {}
  ) => {

    const formData =
      new FormData();


    formData.append(
      "coverImage",
      imageFile
    );


    formData.append(
      "readingLog",
      JSON.stringify(
        jsonData
      )
    );


    const response =
      await api.post(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          ...options,
        }
      );


    validateContentType(
      response
    );


    return response.data;
  };


/* =========================================
   PUT - 이미지 + JSON
========================================= */

export const uploadImageWithJson2 =
  async (
    endpoint,
    imageFile,
    jsonData,
    options = {}
  ) => {

    const formData =
      new FormData();


    formData.append(
      "coverImage",
      imageFile
    );


    formData.append(
      "readingLog",
      JSON.stringify(
        jsonData
      )
    );


    const response =
      await api.put(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },

          ...options,
        }
      );


    validateContentType(
      response
    );


    return response.data;
  };


export default api;