import MainLayout from "../layouts/MainLayout";

function Home() {

  const categories = [
    {
      name: "Cleaning",
      image:
        "https://th.bing.com/th/id/R.d0d8bb0efa8ba3c04f8a3eefc45efd4e?rik=pDsV5%2fqes%2bvX7w&riu=http%3a%2f%2fprestigecleaningservice.com.au%2fwp-content%2fuploads%2f2023%2f07%2fUntitled-design-6.jpg&ehk=2nRiGzkrZiQROg2Jz9r%2bvbbg2PUcy3NfGBB8u0omvPM%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      name: "Plumbing",
      image:
        "https://as1.ftcdn.net/v2/jpg/05/09/53/88/1000_F_509538854_rLCaPrFeOBwdRSF0farUVA5XV8oZCGoA.jpg",
    },
    {
      name: "Electrician",
      image:
        "https://th.bing.com/th/id/OIP.D1qy1tS_vrBWZhkRnOicUAHaE4?w=307&h=187&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
    },
    {
      name: "Painting",
      image:
        "https://images.unsplash.com/photo-1562259949-e8e7689d7828",
    },
    
  ];

  return (
    <MainLayout>
      
      {/* HERO SECTION */}
      <div
        className="relative p-20 rounded-3xl mb-10 text-white overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507089947368-19c1da9775ae')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">
            Find Trusted Services Near You
          </h1>

          <p className="text-lg mb-6">
            Book verified professionals for your home services instantly.
          </p>

          <div className="bg-white rounded-xl flex items-center p-2 shadow-md max-w-xl">
            <input
              placeholder="Search services..."
              className="flex-1 p-3 outline-none text-gray-700"
            />

            <button className="bg-teal-600 text-white px-6 py-3 rounded-xl">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY SECTION */}
      <h2 className="text-2xl font-semibold mb-6">
        Popular Categories
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">

        {categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            {/* IMAGE */}
            <img
              src={cat.image}
              alt={cat.name}
              className="h-40 w-full object-cover"
            />

            {/* TITLE */}
            <div className="p-4 text-center font-semibold text-gray-700">
              {cat.name}
            </div>
          </div>
        ))}

      </div>

    </MainLayout>
  );
}

export default Home;