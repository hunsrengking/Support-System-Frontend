import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const getAccessToken = () =>
  localStorage.getItem("access_token") || localStorage.getItem("token") || null;

export const getRefreshToken = () => localStorage.getItem("refresh_token") || null;

export const setTokens = ({ access_token, refresh_token, user } = {}) => {
  if (access_token) localStorage.setItem("access_token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
  if (user) localStorage.setItem("app_auth_user", JSON.stringify(user));
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("app_auth_user");
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

/**
 * call all queued requests after refresh
 * @param {string|null} token
 */
const onRefreshed = (token) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

const addSubscriber = (cb) => {
  subscribers.push(cb);
};

let logoutCallback = () => { };
export const setLogoutCallback = (fn) => {
  if (typeof fn === "function") logoutCallback = fn;
};

const refreshTokenRequest = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  // Compose refresh URL from axiosClient baseURL
  const base = (axiosClient.defaults && axiosClient.defaults.baseURL) || "";
  const baseNoTrailing = base.replace(/\/$/, "");
  const refreshUrl = `${baseNoTrailing}/refresh`;

  // If your backend expects refresh token in body change here.
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

    // If already refreshing, queue this request and return a promise that'll retry when done
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addSubscriber((token) => {
          if (token) {
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
        // backend expected shape: { access_token, refresh_token, user? } OR { token, ...}
        const newAccess = res.data.access_token || res.data.token;
        const newRefresh = res.data.refresh_token || getRefreshToken();

        if (!newAccess) {
          throw new Error("Refresh did not return new access token");
        }

        setTokens({ access_token: newAccess, refresh_token: newRefresh, user: res.data.user });

        if (!axiosClient.defaults.headers) axiosClient.defaults.headers = {};
        if (!axiosClient.defaults.headers.common) axiosClient.defaults.headers.common = {};
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;

        onRefreshed(newAccess);
        return newAccess;
      })
      .catch((err) => {
        clearTokens();
        try {
          logoutCallback();
        } catch (e) {
          // swallow callback errors
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
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return axiosClient(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export default axiosClient;

