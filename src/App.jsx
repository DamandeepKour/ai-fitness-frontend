// src/App.jsx

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const App = () => {
  const token = localStorage.getItem("token");

  return token ? <Dashboard /> : <Login />;
};

export default App;