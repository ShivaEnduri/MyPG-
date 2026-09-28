


import axios from "axios";
import { firebaseAuth } from "@/config/firebase";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.url) {
      const normalizedUrl = config.url.startsWith("/")
        ? config.url
        : `/${config.url}`;

      // PG is now a standalone application.
      // Every non-shared API request goes through /pg.
      const sharedModules = ["/common/", "/fire/", "/otp/"];

      const isShared = sharedModules.some((prefix) =>
        normalizedUrl.startsWith(prefix)
      );

      if (!isShared && !normalizedUrl.startsWith("/pg/")) {
        config.url = `/pg${normalizedUrl}`;
      } else {
        config.url = normalizedUrl;
      }
    }

    // Attach Firebase authentication token
    const currentUser = firebaseAuth.currentUser;

    if (currentUser) {
      const idToken = await currentUser.getIdToken(false);

      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



// import axios, {
//   AxiosError,
//   InternalAxiosRequestConfig,
// } from "axios";

// /* ============================================================
//    API BASE URL
// ============================================================ */

// export const API_BASE =
//   import.meta.env.VITE_API_URL as string;

// /*
//   Example:

//   VITE_API_URL=http://localhost:5000/api

//   Backend:
//   http://localhost:5000/api/pg/...
// */

// /* ============================================================
//    APPLICATION JWT STORAGE KEY
// ============================================================ */

// export const ACCESS_TOKEN_KEY = "pg_access_token";

// /* ============================================================
//    GET APPLICATION JWT
// ============================================================ */

// export const getAccessToken = (): string | null => {
//   return localStorage.getItem(ACCESS_TOKEN_KEY);
// };

// /* ============================================================
//    SAVE APPLICATION JWT
// ============================================================ */

// export const setAccessToken = (
//   token: string
// ): void => {
//   localStorage.setItem(
//     ACCESS_TOKEN_KEY,
//     token
//   );
// };

// /* ============================================================
//    REMOVE APPLICATION JWT
// ============================================================ */

// export const clearAccessToken = (): void => {
//   localStorage.removeItem(
//     ACCESS_TOKEN_KEY
//   );
// };

// /* ============================================================
//    NORMALIZE URL
// ============================================================ */

// const normalizeUrl = (
//   url: string
// ): string => {

//   if (!url) {
//     return "/";
//   }

//   return url.startsWith("/")
//     ? url
//     : `/${url}`;
// };

// /* ============================================================
//    SHARED / AUTH ROUTES
// ============================================================

//    IMPORTANT:

//    OTP is mounted under:

//    /api/pg/otp/...

//    Therefore OTP MUST NOT be automatically converted
//    into:

//    /api/pg/pg/otp/...

// ============================================================ */

// const alreadyPgPrefixed = (
//   url: string
// ): boolean => {
//   return (
//     url === "/pg" ||
//     url.startsWith("/pg/")
//   );
// };

// /* ============================================================
//    AXIOS INSTANCE
// ============================================================ */

// export const axiosInstance = axios.create({

//   baseURL: API_BASE,

//   headers: {
//     "Content-Type":
//       "application/json",
//   },

//   timeout: 30000,
// });

// /* ============================================================
//    REQUEST INTERCEPTOR
// ============================================================ */

// axiosInstance.interceptors.request.use(

//   async (
//     config: InternalAxiosRequestConfig
//   ) => {

//     let url = normalizeUrl(
//       config.url || ""
//     );

//     /*
//       PG is now a standalone application.

//       Every normal PG API becomes:

//       /pg/...

//       Examples:

//       /pg-info/getAllRecords
//       → /pg/pg-info/getAllRecords

//       /user-roles/getAllRecords
//       → /pg/user-roles/getAllRecords

//       Already-prefixed URLs remain unchanged.
//     */

//     if (!alreadyPgPrefixed(url)) {
//       url = `/pg${url}`;
//     }

//     config.url = url;

//     /* ========================================================
//        APPLICATION JWT

//        DO NOT USE FIREBASE TOKEN HERE.

//        Backend OTP login generates the JWT using:

//        JWT_SECRET

//        Therefore all authenticated PG APIs must receive
//        this JWT.
//     ======================================================== */

//     const token =
//       getAccessToken();

//     if (token) {

//       config.headers =
//         config.headers ?? {};

//       config.headers.Authorization =
//         `Bearer ${token}`;
//     }

//     return config;
//   },

//   (error) => {
//     return Promise.reject(error);
//   }
// );

// /* ============================================================
//    RESPONSE INTERCEPTOR
// ============================================================ */

// axiosInstance.interceptors.response.use(

//   (response) => response,

//   async (
//     error: AxiosError
//   ) => {

//     if (error.response?.status === 401) {

//       /*
//         Do not immediately redirect here.

//         LoginPage may itself be handling authentication.

//         Just clear the expired application token.
//       */

//       clearAccessToken();
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;