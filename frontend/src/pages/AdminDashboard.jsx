import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // BLOCK NON-ADMIN USERS
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-72 bg-black text-white min-h-screen p-8">

        <h1 className="text-3xl font-bold mb-10">
          RentForge Admin
        </h1>

        <nav className="space-y-4">

          {/* DASHBOARD */}
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="block w-full text-left px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
          >
            Dashboard
          </button>

          {/* EQUIPMENT */}
          <button
            onClick={() => navigate("/admin/equipment")}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Equipment Management
          </button>

          {/* BOOKINGS */}
          <button
            onClick={() => navigate("/admin/bookings")}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Booking Management
          </button>

          {/* USERS */}
          <button
            onClick={() => navigate("/admin/users")}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            User Management
          </button>

          
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
          >
            Logout
          </button>
        

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your construction rental platform professionally
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="bg-white rounded-3xl shadow-md p-8">
            <h3 className="text-gray-500 text-lg">
              Total Equipment
            </h3>
            <p className="text-4xl font-bold mt-4">
              50+
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8">
            <h3 className="text-gray-500 text-lg">
              Total Users
            </h3>
            <p className="text-4xl font-bold mt-4">
              100+
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8">
            <h3 className="text-gray-500 text-lg">
              Active Bookings
            </h3>
            <p className="text-4xl font-bold mt-4">
              24
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8">
            <h3 className="text-gray-500 text-lg">
              Revenue
            </h3>
            <p className="text-4xl font-bold mt-4">
              ₹2.4L
            </p>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-12 bg-white rounded-3xl shadow-md p-8">

          <h3 className="text-2xl font-bold mb-6">
            Quick Actions
          </h3>

          <div className="flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/admin/equipment")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Add Equipment
            </button>

            <button
              onClick={() => navigate("/admin/bookings")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              View Bookings
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition"
            >
              Manage Users
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;