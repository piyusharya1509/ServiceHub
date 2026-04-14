import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

function CompleteProfile() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await API.put(
      "/user/me",
      { phone, isProfileComplete: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Profile completed ✅");

    // 🔥 redirect based on role (optional improvement later)
    navigate("/dashboard");
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white p-8 rounded shadow w-full max-w-md">

          <h2 className="text-2xl mb-4 font-bold">
            Complete Your Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            <button className="w-full bg-teal-600 text-white py-3 rounded">
              Save
            </button>

          </form>

        </div>
      </div>
    </MainLayout>
  );
}

export default CompleteProfile;