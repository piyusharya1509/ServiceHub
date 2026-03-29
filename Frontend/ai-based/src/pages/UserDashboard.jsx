import MainLayout from "../layouts/MainLayout";

function UserDashboard() {

  const bookings = [
    {
      name: "Doremon. (Cleaning)",
      time: "2:00 PM",
      status: "On the way",
    },
    {
      name: "John (Plumbing)",
      time: "5:00 PM",
      status: "Scheduled",
    },
  ];

  const history = [
    {
      service: "Cleaning",
      date: "12 Feb",
      price: "$80",
    },
    {
      service: "Electrician",
      date: "20 Jan",
      price: "$120",
    },
  ];

  return (
    <MainLayout>
      <div className="grid md:grid-cols-4 gap-6">

        {/* ===== SIDEBAR ===== */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h2 className="font-bold text-lg mb-6">Dashboard</h2>

          <ul className="space-y-4 text-gray-600">
            <li className="text-teal-600 font-semibold">
              My Bookings
            </li>
            <li>Payments</li>
            <li>Settings</li>
          </ul>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="md:col-span-3 space-y-8">

          {/* WELCOME */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h1 className="text-2xl font-bold">
              Welcome back 👋
            </h1>
            <p className="text-gray-500">
              Here are your active services
            </p>
          </div>

          {/* ACTIVE BOOKINGS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              Active Bookings
            </h2>

            {bookings.map((b, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b py-4"
              >
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-gray-500">
                    time: {b.time}
                  </p>
                </div>

                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg">
                  Chat
                </button>
              </div>
            ))}
          </div>

          {/* HISTORY */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold text-lg mb-4">
              Past Services
            </h2>

            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b">
                  <th className="py-2">Service</th>
                  <th>Date</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-3">{h.service}</td>
                    <td>{h.date}</td>
                    <td>{h.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default UserDashboard;