import axios from "axios";

const BASE_URL =
  "https://wii-cash-apigateway-uat.yliqo.com/api/v1/WiiCashApiGateway";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";

    // ✅ Ignore 401 for LOGIN API so toast can show
    if (status === 401 && !requestUrl.includes("/login")) {
      console.warn("⛔ Session expired. Redirecting to login...");

      try {
        localStorage.clear();
      } catch {}

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);
