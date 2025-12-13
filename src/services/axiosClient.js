// src/services/axiosClient.js
import axios from "axios";

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

export const getAccessToken = () =>
  // keep backward compatibility with older keys
  localStorage.getItem(STORAGE_KEY) ||
  localStorage.getItem("access_token") ||
  localStorage.getItem("token") ||
  null;

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY) || null;

export const setTokens = ({ access_token, refresh_token, user } = {}) => {
  // always persist under unified keys
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

export const parseJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token, offsetSeconds = 10) => {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + offsetSeconds;
};

let isRefreshing = false;
let refreshPromise = null;
let subscribers = [];

const onRefreshed = (token) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

const addSubscriber = (cb) => {
  subscribers.push(cb);
};

let logoutCallback = () => {};
export const setLogoutCallback = (fn) => {
  if (typeof fn === "function") logoutCallback = fn;
};

const refreshTokenRequest = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  // Use axios (not axiosClient) to avoid interceptors on refresh request
  const base =
    axiosClient.defaults && axiosClient.defaults.baseURL
      ? axiosClient.defaults.baseURL.replace(/\/$/, "")
      : "";
  const refreshUrl = `${base}/refresh`.replace(/\/{2,}/g, "/");

  // If your backend expects refresh in headers or form, change this body accordingly.
  return axios.post(refreshUrl, { refresh_token: refreshToken });
};

/* Attach access token to requests */
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Response interceptor to handle 401 -> refresh flow */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response or not 401, just propagate
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent retry loop: if request already marked as retried, bail out
    if (originalRequest && originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // If already refreshing, queue this request and retry after refresh
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addSubscriber((token) => {
          if (token) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    // Start refresh
    isRefreshing = true;
    refreshPromise = refreshTokenRequest()
      .then((res) => {
        // backend expected shape: { access_token, refresh_token, user } OR { token, ... }
        const newAccess = res.data.access_token || res.data.token;
        const newRefresh = res.data.refresh_token || getRefreshToken();

        if (!newAccess) {
          throw new Error("Refresh did not return new access token");
        }

        setTokens({
          access_token: newAccess,
          refresh_token: newRefresh,
          user: res.data.user,
        });

        // update axios defaults so subsequent requests have header by default
        if (!axiosClient.defaults.headers) axiosClient.defaults.headers = {};
        if (!axiosClient.defaults.headers.common)
          axiosClient.defaults.headers.common = {};
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccess}`;

        onRefreshed(newAccess);
        return newAccess;
      })
      .catch((err) => {
        clearTokens();
        try {
          logoutCallback();
        } catch (e) {
          console.warn("logoutCallback threw:", e);
        }
        onRefreshed(null);
        throw err;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });

    try {
      const newToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export default axiosClient;
