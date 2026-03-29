import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between">
      <h1 className="text-xl font-bold">
        ServiceHub
      </h1>

      <div className="space-x-6">
        <Link to="/">Home</Link>
        <Link to="/vendors">Vendors</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;