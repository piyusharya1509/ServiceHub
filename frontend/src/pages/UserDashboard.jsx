import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import toast from "react-hot-toast";

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [activeTab, setActiveTab] = useState("bookings");
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

      if (data?.user) {
        setProfile({
          name: data.user.name || "",
          phone: data.user.phone || "",
        });
      }
    } catch {
      toast.error("Failed to load profile ❌");
    }
  };

  // =========================
  // FETCH PAYMENTS
  // =========================
  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_URL}/payments/my-payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setPayments(data.payments || []);
    } catch {
      toast.error("Failed to load payments ❌");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchUser();
    fetchPayments();
  }, []);

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
  // RELEASE PAYMENT
  // =========================
  const handleRelease = async (bookingId) => {
    try {
      setLoading(true);

      await fetch(`${API_URL}/payments/release/${bookingId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Payment released 💰");
      fetchPayments();
    } catch {
      toast.error("Release failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="grid md:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="font-bold text-lg mb-6">Dashboard</h2>

          <ul className="space-y-4 text-gray-600">
            <li
              onClick={() => setActiveTab("bookings")}
              className={`cursor-pointer ${
                activeTab === "bookings" && "text-teal-600 font-semibold"
              }`}
            >
              My Bookings
            </li>

            <li
              onClick={() => setActiveTab("payments")}
              className={`cursor-pointer ${
                activeTab === "payments" && "text-teal-600 font-semibold"
              }`}
            >
              Payments
            </li>

            <li
              onClick={() => setActiveTab("settings")}
              className={`cursor-pointer ${
                activeTab === "settings" && "text-teal-600 font-semibold"
              }`}
            >
              Settings
            </li>
          </ul>
        </div>

        {/* MAIN */}
        <div className="md:col-span-3 space-y-6">

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">My Bookings</h2>

              {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings yet</p>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b._id}
                    className="border-b py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {b.vendorName || "Service"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {b.date} • {b.time}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-yellow-100 px-2 py-1 rounded text-sm">
                        {b.status}
                      </span>

                      {b.status === "completed" && (
                        <button
                          disabled={loading}
                          onClick={() => handleRelease(b._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                        >
                          {loading ? "Processing..." : "Release Payment"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === "payments" && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Payments</h2>

              {payments.length === 0 ? (
                <p className="text-gray-500">No payments yet</p>
              ) : (
                payments.map((p) => (
                  <div
                    key={p._id}
                    className="border-b py-3 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">₹ {p.amount}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(p.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={
                          p.status === "released"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {p.status}
                      </p>

                      <button
                        onClick={() => window.print()}
                        className="text-sm text-blue-600"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>

              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full border p-3 mb-4 rounded"
              />

              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full border p-3 mb-4 rounded"
              />

              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-50"
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

export default UserDashboard;