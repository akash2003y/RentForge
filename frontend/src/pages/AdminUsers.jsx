import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Fetch users failed:", error);
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchUsers();
    }
  }, [user]);

  // BLOCK NON-ADMIN
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  // DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`http://localhost:8080/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  // TOGGLE ROLE
  const toggleRole = async (selectedUser) => {
    const newRole = selectedUser.role === "ADMIN" ? "USER" : "ADMIN";

    try {
      await axios.put(
        `http://localhost:8080/users/${selectedUser.userId}/role?role=${newRole}`
      );

      fetchUsers();

    } catch (error) {
      console.error(error);
      alert("Role update failed");
    }
  };

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

          <button
            onClick={() => navigate("/admin/bookings")}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800"
          >
            Booking Management
          </button>

          <button
            className="block w-full text-left px-4 py-3 rounded-xl bg-blue-600"
          >
            User Management
          </button>

        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            User Management
          </h2>

          <p className="text-gray-500 mt-2">
            Manage all registered users
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Phone</th>
                <th className="text-left p-4">Provider</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.userId} className="border-t">

                  <td className="p-4">{u.userId}</td>

                  <td className="p-4 font-semibold">
                    {u.name || "N/A"}
                  </td>

                  <td className="p-4">{u.email}</td>

                  <td className="p-4">
                    {u.contact || "N/A"}
                  </td>

                  <td className="p-4">
                    {u.provider || "LOCAL"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2">

                    <button
                      onClick={() => toggleRole(u)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                      Make {u.role === "ADMIN" ? "USER" : "ADMIN"}
                    </button>

                    <button
                      onClick={() => handleDelete(u.userId)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </main>

    </div>
  );
}

export default AdminUsers;