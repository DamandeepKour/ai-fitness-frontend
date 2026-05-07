// src/App.jsx

import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return token ? <Dashboard /> : <Login onLogin={setToken} />;
};

export default App;