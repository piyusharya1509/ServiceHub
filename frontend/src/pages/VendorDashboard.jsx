import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState("");
  const [profile, setProfile] = useState({ name: "", phone: "" });

  const token = localStorage.getItem("token");

  // =========================
  // FETCH BOOKINGS
  // =========================
  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setBookings(data.bookings || []);
  };

  // =========================
  // FETCH USER
  // =========================
  const fetchUser = async () => {
    const res = await fetch("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setProfile({
      name: data.user?.name || "",
      phone: data.user?.phone || "",
    });
  };

  // =========================
  // FETCH EARNINGS
  // =========================
  const fetchEarnings = async () => {
    const res = await fetch("http://localhost:5000/api/payments/vendor-earnings", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setEarnings(data.total || 0);
  };

  // =========================
  // FETCH WITHDRAWALS
  // =========================
  const fetchWithdrawals = async () => {
    const res = await fetch("http://localhost:5000/api/withdrawals/my-withdrawals", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setWithdrawals(data.withdrawals || []);
  };

  useEffect(() => {
    fetchBookings();
    fetchUser();
    fetchEarnings();
    fetchWithdrawals();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchBookings();
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    await fetch("http://localhost:5000/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });

    alert("Profile updated ✅");
  };

  // =========================
  // REQUEST WITHDRAWAL
  // =========================
  const requestWithdrawal = async () => {
    if (!amount) return alert("Enter amount");

    await fetch("http://localhost:5000/api/withdrawals/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        accountDetails: {
          accountNumber: "1234567890",
          ifsc: "SBIN0001234",
          name: profile.name,
        },
      }),
    });

    alert("Withdrawal requested 💸");
    setAmount("");
    fetchWithdrawals();
  };

  return (
    <MainLayout>
      <div className="grid md:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-bold text-lg mb-6">Vendor Panel</h2>

          <ul className="space-y-4">
            <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
            <li onClick={() => setActiveTab("jobs")}>My Jobs</li>
            <li onClick={() => setActiveTab("withdrawals")}>Withdrawals</li>
            <li onClick={() => setActiveTab("profile")}>Profile</li>
          </ul>
        </div>

        {/* MAIN */}
        <div className="md:col-span-3 space-y-6">

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2>Total Earnings</h2>
                <p className="text-2xl font-bold text-green-600">
                  ₹ {earnings}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="mb-4">New Requests</h2>

                {bookings
                  .filter((b) => b.status === "Scheduled")
                  .map((b) => (
                    <div key={b._id} className="flex justify-between py-3">
                      <div>
                        <p>{b.vendorName}</p>
                        <p className="text-sm text-gray-500">
                          {b.date} • {b.time}
                        </p>
                      </div>

                      <div>
                        <button
                          onClick={() => updateStatus(b._id, "accepted")}
                          className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => updateStatus(b._id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* JOBS */}
          {activeTab === "jobs" && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="mb-4">Accepted Jobs</h2>

              {bookings
                .filter((b) => b.status === "accepted")
                .map((b) => (
                  <div key={b._id} className="border-b py-3">
                    <p>{b.vendorName}</p>
                    <p className="text-sm text-gray-500">
                      {b.date} • {b.time}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* WITHDRAWALS */}
          {activeTab === "withdrawals" && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2>Request Withdrawal</h2>

                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="border p-2 mr-2"
                />

                <button
                  onClick={requestWithdrawal}
                  className="bg-teal-600 text-white px-4 py-2"
                >
                  Request
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h2>Withdrawal History</h2>

                {withdrawals.map((w) => (
                  <div key={w._id} className="flex justify-between py-2 border-b">
                    <span>₹ {w.amount}</span>
                    <span>{w.status}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full border p-3 mb-4"
              />

              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full border p-3 mb-4"
              />

              <button
                onClick={handleSave}
                className="bg-teal-600 text-white px-4 py-2"
              >
                Save
              </button>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default VendorDashboard;