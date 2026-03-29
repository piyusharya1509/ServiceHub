import MainLayout from "../layouts/MainLayout";

function VendorDashboard() {

  const requests = [
    {
      customer: "Rahul Sharma",
      service: "AC Repair",
      time: "Today • 3:00 PM",
    },
    {
      customer: "Anita Das",
      service: "House Cleaning",
      time: "Tomorrow • 11:00 AM",
    },
  ];

  return (
    <MainLayout>

      <div className="grid md:grid-cols-4 gap-6">

        {/*  SIDEBAR  */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="font-bold text-lg mb-6">
            Vendor Panel
          </h2>

          <ul className="space-y-4 text-gray-600">
            <li className="text-teal-600 font-semibold">
              Dashboard
            </li>
            <li>My Jobs</li>
            <li>Earnings</li>
            <li>Profile</li>
          </ul>
        </div>

        {/*  MAIN CONTENT */}
        <div className="md:col-span-3 space-y-6">

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">Today's Jobs</p>
              <h2 className="text-3xl font-bold">3</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">Monthly Earnings</p>
              <h2 className="text-3xl font-bold">₹18,500</h2>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-500">Rating</p>
              <h2 className="text-3xl font-bold">4.8 ⭐</h2>
            </div>

          </div>

          {/* JOB REQUESTS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              New Job Requests
            </h2>

            {requests.map((job, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <p className="font-medium">{job.customer}</p>
                  <p className="text-sm text-gray-500">
                    {job.service} • {job.time}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-lg">
                    Accept
                  </button>

                  <button className="border px-4 py-2 rounded-lg">
                    Reject
                  </button>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default VendorDashboard;