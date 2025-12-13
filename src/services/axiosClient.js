// src/services/axiosClient.js
import axios from "axios";
import { loadingService } from "./loadingService";
import { errorService } from "./errorService";

const STORAGE_KEY = "app_auth_token";
const USER_KEY = "app_auth_user";
const REFRESH_KEY = "refresh_token";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== TOKEN HELPERS ===================== */

export const getAccessToken = () =>
  localStorage.getItem(STORAGE_KEY) ||
  localStorage.getItem("access_token") ||
  localStorage.getItem("token") ||
  null;

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY) || null;

export const setTokens = ({ access_token, refresh_token, user } = {}) => {
  if (access_token) localStorage.setItem(STORAGE_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("permissions");
};

/* ===================== JWT HELPERS ===================== */

export const parseJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token, offsetSeconds = 10) => {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + offsetSeconds;
};

/* ===================== REFRESH FLOW ===================== */

let isRefreshing = false;
let subscribers = [];

const onRefreshed = (token) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

const addSubscriber = (cb) => subscribers.push(cb);

let logoutCallback = () => { };
export const setLogoutCallback = (fn) => {
  if (typeof fn === "function") logoutCallback = fn;
};

const refreshTokenRequest = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  // IMPORTANT: use axios (no interceptors, no loading)
  const base = axiosClient.defaults.baseURL?.replace(/\/$/, "") || "";
  const refreshUrl = `${base}/refresh`.replace(/\/{2,}/g, "/");

  return axios.post(refreshUrl, { refresh_token: refreshToken });
};

/* ===================== REQUEST INTERCEPTOR ===================== */

axiosClient.interceptors.request.use(
  (config) => {
    if (!config._skipLoading) {
      loadingService.show();
      config._loadingShown = true;
    }

    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    loadingService.hide();
    return Promise.reject(error);
  }
);

/* ===================== RESPONSE INTERCEPTOR ===================== */

axiosClient.interceptors.response.use(
  (response) => {
    // ⭐ hide loading
    if (response.config?._loadingShown) {
      loadingService.hide();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ⭐ hide loading for failed requests
    if (originalRequest?._loadingShown) {
      loadingService.hide();
    }

    if (!error.response || error.response.status !== 401) {
      if (error.response?.data) {
        const data = error.response.data;

        const message =
          data.message ||
          data.detail ||
          data.error ||
          (Array.isArray(data.errors)
            ? data.errors.join(", ")
            : typeof data.errors === "object"
              ? Object.values(data.errors).flat().join(", ")
              : null) ||
          (typeof data === "string" ? data : null) ||
          "Something went wrong. Please try again.";

        errorService.show(message);
      } else {
        errorService.show("Network error. Please check your connection.");
      }

      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addSubscriber((token) => {
          if (!token) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await refreshTokenRequest(); // ❗ no loading
      const newAccess = res.data.access_token || res.data.token;
      const newRefresh = res.data.refresh_token || getRefreshToken();

      if (!newAccess) throw new Error("No access token returned");

      setTokens({
        access_token: newAccess,
        refresh_token: newRefresh,
        user: res.data.user,
      });

      axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

      onRefreshed(newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return axiosClient(originalRequest);
    } catch (err) {
      clearTokens();
      try {
        logoutCallback();
      } catch {
        console.log(err);
      }
      onRefreshed(null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
