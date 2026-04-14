import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

function AdminDashboard() {
  const [revenue, setRevenue] = useState(0);
  const [sales, setSales] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [kycVendors, setKycVendors] = useState([]);

  const token = localStorage.getItem("token");

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      // 🔥 REVENUE
      const res1 = await fetch(
        "https://servicehub-77ky.onrender.com/api/payments/admin/revenue",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data1 = await res1.json();
      setRevenue(data1.totalRevenue || 0);
      setSales(data1.totalSales || 0);

      // 🔥 TOP VENDORS
      const res2 = await fetch(
        "https://servicehub-77ky.onrender.com/api/payments/admin/top-vendors",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data2 = await res2.json();
      setVendors(data2.vendors || []);

      // 🔥 KYC PENDING VENDORS
      const res3 = await fetch(
        "https://servicehub-77ky.onrender.com/api/admin/kyc",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data3 = await res3.json();
      setKycVendors(data3.vendors || []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // APPROVE KYC
  // =========================
  const approveKYC = async (id) => {
    try {
      await fetch(
        `https://servicehub-77ky.onrender.com/api/admin/kyc/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Vendor Verified ✅");

      fetchData(); // refresh list
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ========================= */}
        {/* STATS */}
        {/* ========================= */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2>Total Revenue</h2>
            <p className="text-2xl font-bold text-green-600">
              ₹ {revenue}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2>Total Sales</h2>
            <p className="text-2xl font-bold">
              ₹ {sales}
            </p>
          </div>
        </div>

        {/* ========================= */}
        {/* TOP VENDORS */}
        {/* ========================= */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl mb-4">Top Vendors</h2>

          {vendors.length === 0 ? (
            <p className="text-gray-500">No data</p>
          ) : (
            vendors.map((v, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-2"
              >
                <span>{v.vendor}</span>
                <span>₹ {v.earnings}</span>
              </div>
            ))
          )}
        </div>

        {/* ========================= */}
        {/* 🔥 KYC VERIFICATION PANEL */}
        {/* ========================= */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl mb-4">Pending KYC Requests</h2>

          {kycVendors.length === 0 ? (
            <p className="text-gray-500">No pending KYC</p>
          ) : (
            kycVendors.map((v) => (
              <div
                key={v._id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-sm text-gray-500">{v.email}</p>
                  <p className="text-xs text-gray-400">
                    PAN: {v.kyc?.pan} | Aadhaar: {v.kyc?.aadhaar}
                  </p>
                </div>

                <button
                  onClick={() => approveKYC(v._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default AdminDashboard;