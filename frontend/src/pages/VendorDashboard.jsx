import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";

function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState("");
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = "https://servicehub-77ky.onrender.com/api";

  // =========================
  // FETCH BOOKINGS
  // =========================
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      toast.error("Failed to load bookings ❌");
    }
  };

  // =========================
  // FETCH USER
  // =========================
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setProfile({
        name: data.user?.name || "",
        phone: data.user?.phone || "",
      });
    } catch {
      toast.error("Failed to load profile ❌");
    }
  };

  // =========================
  // FETCH EARNINGS
  // =========================
  const fetchEarnings = async () => {
    try {
      const res = await fetch(`${API_URL}/payments/vendor-earnings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setEarnings(data.total || 0);
    } catch {
      toast.error("Failed to load earnings ❌");
    }
  };

  // =========================
  // FETCH WITHDRAWALS
  // =========================
  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(`${API_URL}/withdrawals/my-withdrawals`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setWithdrawals(data.withdrawals || []);
    } catch {
      toast.error("Failed to load withdrawals ❌");
    }
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
    try {
      setLoading(true);

      await fetch(`${API_URL}/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      toast.success(`Job ${status} ✅`);
      fetchBookings();
    } catch {
      toast.error("Action failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    try {
      setLoading(true);

      await fetch(`${API_URL}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      toast.success("Profile updated ✅");
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REQUEST WITHDRAWAL
  // =========================
  const requestWithdrawal = async () => {
    if (!amount) {
      toast.error("Enter amount ❌");
      return;
    }

    try {
      setLoading(true);

      await fetch(`${API_URL}/withdrawals/request`, {
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

      toast.success("Withdrawal requested 💸");
      setAmount("");
      fetchWithdrawals();
    } catch {
      toast.error("Withdrawal failed ❌");
    } finally {
      setLoading(false);
    }
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
                <p className="text-sm text-gray-500">
                  (Only released payments)
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
                          disabled={loading}
                          onClick={() => updateStatus(b._id, "accepted")}
                          className="bg-green-500 text-white px-3 py-1 mr-2 rounded disabled:opacity-50"
                        >
                          Accept
                        </button>

                        <button
                          disabled={loading}
                          onClick={() => updateStatus(b._id, "rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
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
              <h2 className="mb-4">Jobs</h2>

              {bookings.map((b) => (
                <div key={b._id} className="border-b py-3">
                  <p>{b.vendorName}</p>
                  <p className="text-sm text-gray-500">
                    {b.date} • {b.time}
                  </p>

                  <p className="text-sm mt-1">
                    Payment:{" "}
                    <span
                      className={
                        b.status === "completed"
                          ? "text-green-600 font-semibold"
                          : "text-yellow-600 font-semibold"
                      }
                    >
                      {b.status === "completed"
                        ? "Paid 💰"
                        : "In Escrow ⏳"}
                    </span>
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
                  disabled={loading}
                  onClick={requestWithdrawal}
                  className="bg-teal-600 text-white px-4 py-2 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Request"}
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
                disabled={loading}
                onClick={handleSave}
                className="bg-teal-600 text-white px-4 py-2 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default VendorDashboard;