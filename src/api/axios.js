// src/api/axios.js

import axios from "axios";
import { getAuthToken } from "@/lib/auth-token";

/** Backend mounts routes at /api (see server.js). Base URL must end with /api. */
function resolveApiBaseUrl() {
  let url = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
  if (!url) return url;
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
}

const API = axios.create({
  baseURL: resolveApiBaseUrl(),
});

API.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;