import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await API.post("/auth/signup", {
        ...formData,
        role,
      });

      alert("Signup successful!");
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE SIGNUP (PRODUCTION)
  const handleGoogleSignup = () => {
    window.location.href = `https://servicehub-77ky.onrender.com/api/auth/google?role=${role}`;
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">

          <h2 className="text-3xl font-bold text-center mb-2">
            Create Account
          </h2>

          {/* ROLE */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button
              onClick={() => setRole("customer")}
              className={`flex-1 py-2 rounded-full ${
                role === "customer" ? "bg-teal-600 text-white" : ""
              }`}
            >
              Customer
            </button>

            <button
              onClick={() => setRole("vendor")}
              className={`flex-1 py-2 rounded-full ${
                role === "vendor" ? "bg-teal-600 text-white" : ""
              }`}
            >
              Vendor
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <input
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <button className="w-full bg-teal-600 text-white py-3 rounded-lg">
              Sign Up
            </button>
          </form>

          <button
            onClick={handleGoogleSignup}
            className="w-full mt-4 border py-3 rounded-lg"
          >
            Continue with Google
          </button>

        </div>
      </div>
    </MainLayout>
  );
}

export default Signup;