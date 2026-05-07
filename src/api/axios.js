// src/api/axios.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const getTokenFromCookie = () => {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("token="));

  if (!cookie) return null;
  return decodeURIComponent(cookie.split("=")[1]);
};

API.interceptors.request.use((config) => {
  const token = getTokenFromCookie() || localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;