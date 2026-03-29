import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

function Booking() {

  const [step, setStep] = useState(1);

  return (
    <MainLayout>

      <div className="max-w-4xl mx-auto bg-white p-12 rounded-4xl shadow-md">

        {/* STEP INDICATOR */}
        <div className="flex justify-between mb-8 text-sm font-bold">
          <p className={step === 1 ? "text-teal-600" : ""}>
            1. Details
          </p>
          <p className={step === 2 ? "text-teal-600" : ""}>
            2. Schedule
          </p>
          <p className={step === 3 ? "text-teal-600" : ""}>
            3. Confirm
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Job Details
            </h2>

            <textarea
              placeholder="Describe the issue..."
              className="w-full border p-4 rounded-lg mb-4"
              rows="10"
            />

            <input
              type="file"
              className="mb-6"
          
            />

            <button
              onClick={() => setStep(2)}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Select Schedule
            </h2>

            <input
              type="date"
              className="w-full border p-3 rounded-lg mb-4"
            />

            <input
              type="time"
              className="w-full border p-3 rounded-lg mb-6"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="border px-6 py-3 rounded-lg"
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Confirm Booking
            </h2>

            <p className="text-gray-500 mb-6">
              Please confirm your service booking.
            </p>

            <button className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700">
              Confirm Booking
            </button>

            <button
              onClick={() => setStep(2)}
              className="block mx-auto mt-4 text-sm text-gray-500"
            >
              Go Back
            </button>
          </div>
        )}

      </div>

    </MainLayout>
  );
}

export default Booking;