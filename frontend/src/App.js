import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Vendors from "./pages/Vendors";
import Booking from "./pages/Booking";
import UserDashboard from "./pages/UserDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Signup from "./pages/Signup";
import OAuthSuccess from "./pages/OAuthSuccess";
import CompleteProfile from "./pages/CompleteProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) console.log("User session restored");
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/booking" element={<Booking />} />

        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;