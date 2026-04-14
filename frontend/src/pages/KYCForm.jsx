import { useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

function KYCForm() {
  const [form, setForm] = useState({
    aadhaar: "",
    pan: "",
    documentUrl: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await API.post("/user/kyc", form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("KYC Submitted!");
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Vendor KYC</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Aadhaar" onChange={(e) => setForm({...form, aadhaar: e.target.value})} />
          <input placeholder="PAN" onChange={(e) => setForm({...form, pan: e.target.value})} />
          <input placeholder="Document URL" onChange={(e) => setForm({...form, documentUrl: e.target.value})} />

          <button className="bg-teal-600 text-white px-4 py-2">
            Submit
          </button>
        </form>
      </div>
    </MainLayout>
  );
}

export default KYCForm;