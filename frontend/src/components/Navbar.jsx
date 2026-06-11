import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.jpg";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-1">
          <img
            src={logo}
            alt="RentForge Logo"
            className="w-12 h-12 object-contain rounded-lg"
          />

          <div className="text-2xl font-bold">
            <span className="text-black">Rent</span>
            <span className="text-blue-600">Forge</span>
          </div>
        </Link>

        {/* NAVIGATION */}
        <div className="flex items-center gap-6">

          {/* HOME */}
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>

          {/* EQUIPMENT */}
          <Link
            to="/equipment"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Equipment
          </Link>

          {!user ? (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>

              {/* REGISTER */}
              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* USER DROPDOWN */}
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  onClick={() =>
                    setDropdownOpen(!dropdownOpen)
                  }
                  className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
                >
                  {/* PROFILE PIC */}
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0)}
                    </div>
                  )}

                  {/* USER NAME */}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>

                  {/* DROPDOWN ICON */}
                  <span className="text-xs text-gray-600">
                    ▼
                  </span>
                </button>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white border rounded-2xl shadow-xl overflow-hidden z-50">

                    {/* PROFILE */}
                    <Link
                      to="/profile"
                      onClick={() =>
                        setDropdownOpen(false)
                      }
                      className="block px-5 py-3 hover:bg-gray-100 transition"
                    >
                      My Profile
                    </Link>
                    {/* MY BOOKINGS */}
                    <Link
                      to="/my-bookings"
                      onClick={() =>
                        setDropdownOpen(false)
                      }
                      className="block px-5 py-3 hover:bg-gray-100 transition"
                    >
                      My Bookings
                    </Link>

                    {/* ADMIN DASHBOARD */}
                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() =>
                          setDropdownOpen(false)
                        }
                        className="block px-5 py-3 hover:bg-gray-100 transition"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;