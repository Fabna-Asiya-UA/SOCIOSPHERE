import { Link, useNavigate } from "react-router-dom";

function Navbar({ loggedIn, setLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-gradient-to-r from-pink-300 to-purple-600 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4 text-white">

      
        <Link to="/" className="text-2xl font-bold text-purple-900">
          SocioSphere
        </Link>

    
        <div className="flex items-center gap-4">
          <Link to="/" className="px-4 py-2 rounded-lg hover:bg-purple-500 transition">
            Feed
          </Link>

          <Link to="/search" className="px-4 py-2 rounded-lg hover:bg-purple-500 transition">
            Search
          </Link>

          {loggedIn ? (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-lg hover:bg-purple-500 transition"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
