import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Vendors from "./pages/Vendors";
import Booking from "./pages/Booking";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;