import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

function AdminDashboard() {
  const [revenue, setRevenue] = useState(0);
  const [sales, setSales] = useState(0);
  const [vendors, setVendors] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    // 🔥 REVENUE
    const res1 = await fetch("http://localhost:5000/api/payments/admin/revenue", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data1 = await res1.json();
    setRevenue(data1.totalRevenue || 0);
    setSales(data1.totalSales || 0);

    // 🔥 TOP VENDORS
    const res2 = await fetch("http://localhost:5000/api/payments/admin/top-vendors", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data2 = await res2.json();
    setVendors(data2.vendors || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2>Total Revenue</h2>
            <p className="text-2xl font-bold text-green-600">₹ {revenue}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2>Total Sales</h2>
            <p className="text-2xl font-bold">₹ {sales}</p>
          </div>
        </div>

        {/* TOP VENDORS */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl mb-4">Top Vendors</h2>

          {vendors.map((v, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span>{v.vendor}</span>
              <span>₹ {v.earnings}</span>
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

export default AdminDashboard;