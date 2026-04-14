import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Booking() {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state;

  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const token = localStorage.getItem("token");

  if (!vendor) {
    return <p className="p-6">No vendor selected</p>;
  }

  // =====================================
  // 🔥 HANDLE PAYMENT + BOOKING
  // =====================================
  const handlePayment = async () => {
    try {
      if (!date || !time || !details) {
        return alert("Fill all fields ❗");
      }

      // 1️⃣ CREATE ORDER FROM BACKEND
      const res = await fetch(
        "http://localhost:5000/api/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: vendor.price || 500,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        return alert("Order creation failed ❌");
      }

      // 2️⃣ OPEN RAZORPAY CHECKOUT
      const options = {
        key: "rzp_test_xxxxx", // 🔥 PUT YOUR REAL KEY HERE
        amount: data.order.amount,
        currency: "INR",
        name: "ServiceHub",
        description: vendor.name,
        order_id: data.order.id,

        handler: async function (response) {
          try {
            // 3️⃣ VERIFY PAYMENT
            const verifyRes = await fetch(
              "http://localhost:5000/api/payments/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...response,
                  amount: vendor.price,
                  vendorId: vendor._id,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              return alert("Payment verification failed ❌");
            }

            // 4️⃣ CREATE BOOKING
            await fetch("http://localhost:5000/api/bookings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                vendorId: vendor._id,
                serviceId: "dummy-service-id",
                scheduledAt: new Date(`${date}T${time}`),
                address: details,
              }),
            });

            alert("Payment successful 🎉 Booking confirmed");
            navigate("/dashboard");

          } catch (err) {
            console.error(err);
            alert("Booking failed ❌");
          }
        },

        prefill: {
          name: "User",
          email: "test@email.com",
        },

        theme: {
          color: "#14b8a6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow mt-6">

        {/* VENDOR INFO */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">{vendor.name}</h2>
          <p>₹ {vendor.price}</p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex justify-between mb-6 font-semibold">
          <p className={step === 1 ? "text-teal-600" : ""}>1. Details</p>
          <p className={step === 2 ? "text-teal-600" : ""}>2. Schedule</p>
          <p className={step === 3 ? "text-teal-600" : ""}>3. Confirm</p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe your issue..."
              className="w-full border p-4 rounded mb-4"
            />

            <button
              onClick={() => {
                if (!details) return alert("Enter details");
                setStep(2);
              }}
              className="bg-teal-600 text-white px-6 py-2 rounded"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-3 mb-3"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border p-3 mb-3"
            />

            <button onClick={() => setStep(1)}>Back</button>

            <button
              onClick={() => {
                if (!date || !time) return alert("Select date/time");
                setStep(3);
              }}
              className="bg-teal-600 text-white px-6 py-2 ml-4"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">
              Confirm & Pay
            </h2>

            <div className="bg-gray-100 p-4 rounded mb-4 text-left">
              <p><strong>Vendor:</strong> {vendor.name}</p>
              <p><strong>Details:</strong> {details}</p>
              <p><strong>Date:</strong> {date}</p>
              <p><strong>Time:</strong> {time}</p>
            </div>

            {/* 🔥 PAY BUTTON */}
            <button
              onClick={handlePayment}
              className="bg-teal-600 text-white px-6 py-2 rounded"
            >
              Pay ₹{vendor.price} & Confirm
            </button>

            <button
              onClick={() => setStep(2)}
              className="block mt-3 text-gray-500"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Booking;