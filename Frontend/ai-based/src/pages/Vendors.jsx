import MainLayout from "../layouts/MainLayout";

function Vendors() {

  const vendors = [
    {
      name: "Doremon cleaning service",
      rating: 4.8,
      price: 10,
      image:
        "https://th.bing.com/th/id/OIP.UhriXACJAJkFTgk0loNYwgHaHa?w=150&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
    },
    {
      name: "Chota bheem Electrican",
      rating: 4.6,
      price: 120,
      image:
        "https://th.bing.com/th/id/OIP.BEhGes1Kw0qrNYed91S6_wHaGR?w=191&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
    },
    {
      name: " Painter Rangers",
      rating: 4.7,
      price: 180,
      image:
        "https://th.bing.com/th/id/OIP.9DeYIzrpefghI75whqvF7QHaEK?w=290&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
    },
  ];

  return (
    <MainLayout>

      <div className="grid md:grid-cols-4 gap-8">

        {/* LEFT FILTER SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-md h-fit">

          <h2 className="font-semibold text-lg mb-4">Filters</h2>

          {/* PRICE */}
          <div className="mb-6">
            <p className="font-medium mb-2">Price Range</p>
            <input type="range" className="w-full" />
          </div>

          {/* RATING */}
          <div className="mb-6">
            <p className="font-medium mb-2">Rating</p>
            <div className="space-y-2">
              <p>⭐ 4 & above</p>
              <p>⭐ 3 & above</p>
            </div>
          </div>

          {/* AVAILABILITY */}
          <div>
            <p className="font-medium mb-2">Availability</p>
            <label className="block">
              <input type="radio" name="avail" /> All
            </label>
            <label className="block">
              <input type="radio" name="avail" /> Today
            </label>
          </div>

        </div>

        {/* RIGHT VENDOR LIST */}
        <div className="md:col-span-3 space-y-6">

          {vendors.map((vendor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-5 flex gap-6 items-center hover:shadow-xl transition"
            >
              {/* IMAGE */}
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-28 h-28 object-cover rounded-xl"
              />

              {/* INFO */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {vendor.name}
                </h3>

                <p className="text-yellow-500">
                  ⭐ {vendor.rating}
                </p>

                <p className="text-gray-500 mt-1">
                  Starting at ${vendor.price}
                </p>
              </div>

              {/* BUTTON */}
              <button className="bg-[#097969] text-white px-5 py-2 rounded-lg hover:bg-teal-700">
                View Profile
              </button>
            </div>
          ))}

        </div>

      </div>

    </MainLayout>
  );
}

export default Vendors;