import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8080/bookings");
      setBookings(res.data);
    } catch (error) {
      console.error("Booking fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchBookings();
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  // APPROVE
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:8080/bookings/${id}/status`, {
        status: "Approved"
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? { ...booking, status: "Approved" }
            : booking
        )
      );

      alert("Booking approved successfully");
    } catch (error) {
      console.error(error);
      alert("Approval failed");
    }
  };

  // COMPLETE
  const handleComplete = async (id) => {
    try {
      await axios.put(`http://localhost:8080/bookings/${id}/status`, {
        status: "Completed"
      });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id
            ? { ...booking, status: "Completed" }
            : booking
        )
      );

      alert("Booking marked as completed");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  // DELETE
  const handleCancel = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/bookings/${id}`
      );

      alert(response.data);

      // INSTANT UI REMOVE
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== id)
      );

    } catch (error) {
      console.error(
        "Delete failed:",
        error.response?.data || error.message
      );

      alert("Delete failed");
    }
  };

  // STATS
  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (b) => b.status === "Pending"
  ).length;

  const completedBookings = bookings.filter(
    (b) => b.status === "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-black text-white min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-10">
          RentForge Admin
        </h1>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/equipment")}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800"
          >
            Equipment Management
          </button>

          <button className="block w-full text-left px-4 py-3 rounded-xl bg-blue-600">
            Booking Management
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800"
          >
            User Management
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10">
        <div className="mb-10">
          <h2 className="text-4xl font-bold">
            Booking Management
          </h2>

          <p className="text-gray-500 mt-2">
            Manage customer bookings efficiently
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg text-gray-500">
              Total Bookings
            </h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {totalBookings}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg text-gray-500">
              Pending
            </h3>
            <p className="text-4xl font-bold text-yellow-500 mt-2">
              {pendingBookings}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg text-gray-500">
              Completed
            </h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {completedBookings}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              Loading bookings...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Equipment ID</th>
                  <th className="p-4 text-left">Start</th>
                  <th className="p-4 text-left">End</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t">
                    <td className="p-4">{booking.id}</td>
                    <td className="p-4">{booking.name}</td>
                    <td className="p-4">{booking.email}</td>
                    <td className="p-4">{booking.phone}</td>
                    <td className="p-4">{booking.equipmentId}</td>
                    <td className="p-4">{booking.startDate}</td>
                    <td className="p-4">{booking.endDate}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "Approved"
                            ? "bg-blue-100 text-blue-700"
                            : booking.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="p-4 flex flex-wrap gap-2">
                      {booking.status === "Pending" && (
                        <button
                          onClick={() =>
                            handleApprove(booking.id)
                          }
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg"
                        >
                          Approve
                        </button>
                      )}

                      {booking.status !== "Completed" && (
                        <button
                          onClick={() =>
                            handleComplete(booking.id)
                          }
                          className="bg-green-500 text-white px-3 py-2 rounded-lg"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleCancel(booking.id)
                        }
                        className="bg-red-500 text-white px-3 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminBookings;