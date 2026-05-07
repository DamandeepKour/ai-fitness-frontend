// src/pages/Login.jsx

import { useState } from "react";
import API from "../api/axios";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const setAuthCookie = (token) => {
    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; samesite=lax`;
  };

  const handleLogin = async () => {
    try {
      setError("");
      const res = await API.post("/auth/login", form);
      const token = res.data?.data?.token;

      if (!token) {
        setError("Login failed: token not received.");
        return;
      }

      localStorage.setItem("token", token);
      setAuthCookie(token);
      onLogin?.(token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-secondary">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          placeholder="Email"
          className="w-full p-2 border mb-3"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full p-2 border mb-3"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Login
        </button>
        {error ? <p className="text-red-500 text-sm mt-3">{error}</p> : null}
      </div>
    </div>
  );
};

export default Login;