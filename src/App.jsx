import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateLayout from "./layout/PrivateLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./routes/index";
import MealsPage from "./routes/meals";
import AddPage from "./routes/add";
import ProgressPage from "./routes/progress";
import ProfilePage from "./routes/profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;