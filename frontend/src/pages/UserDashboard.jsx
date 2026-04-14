import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]); // 🔥 NEW
  const [profile, setProfile] = useState({ name: "", phone: "" });
  const [activeTab, setActiveTab] = useState("bookings");

  const token = localStorage.getItem("token");

  // 🔥 FETCH BOOKINGS
  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data && data.bookings) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Bookings error:", err);
      setBookings([]);
    }
  };

  // 🔥 FETCH USER
  const fetchUser = async () => {
    try {
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data && data.success && data.user) {
        setProfile({
          name: data.user?.name || "",
          phone: data.user?.phone || "",
        });
      } else {
        setProfile({ name: "", phone: "" });
      }
    } catch (err) {
      console.error("User fetch error:", err);
      setProfile({ name: "", phone: "" });
    }
  };

  // 🔥 FETCH PAYMENTS (NEW)
  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payments/my-payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data && data.payments) {
        setPayments(data.payments);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.error("Payments error:", err);
      setPayments([]);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchUser();
    fetchPayments(); // 🔥 ADDED
  }, []);

  // 🔥 SAVE PROFILE
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (data.success) {
        alert("Profile updated ✅");
      } else {
        alert("Update failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
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
                activeTab === "bookings"
                  ? "text-teal-600 font-semibold"
                  : ""
              }`}
            >
              My Bookings
            </li>

            <li
              onClick={() => setActiveTab("payments")}
              className={`cursor-pointer ${
                activeTab === "payments"
                  ? "text-teal-600 font-semibold"
                  : ""
              }`}
            >
              Payments
            </li>

            <li
              onClick={() => setActiveTab("settings")}
              className={`cursor-pointer ${
                activeTab === "settings"
                  ? "text-teal-600 font-semibold"
                  : ""
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
              <h2 className="text-xl font-semibold mb-4">
                My Bookings
              </h2>

              {bookings.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b._id}
                    className="border-b py-3 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {b.vendorName || "Service"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {b.date || "-"} • {b.time || "-"}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        b.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : b.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status || "pending"}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PAYMENTS (UPDATED) */}
          {activeTab === "payments" && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Payments
              </h2>

              {payments.length === 0 ? (
                <p>No payments yet</p>
              ) : (
                payments.map((p) => (
                  <div
                    key={p._id}
                    className="border-b py-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">₹ {p.amount}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(p.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-green-600">{p.status}</p>

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
              <h2 className="text-xl font-semibold mb-4">
                Settings
              </h2>

              <input
                value={profile?.name || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                placeholder="Name"
                className="w-full border p-3 mb-4 rounded"
              />

              <input
                value={profile?.phone || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone"
                className="w-full border p-3 mb-4 rounded"
              />

              <button
                onClick={handleSave}
                className="bg-teal-600 text-white px-4 py-2 rounded"
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

export default UserDashboard;