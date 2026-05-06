// src/pages/Login.jsx

import { useState } from "react";
import API from "../api/axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const res = await API.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);

    window.location.href = "/";
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
      </div>
    </div>
  );
};

export default Login;