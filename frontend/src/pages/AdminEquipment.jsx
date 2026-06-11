import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import noImage from "../assets/no-image.jpg";

function AdminEquipment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    availability: "Available",
    quantity: 1
  });

  // FETCH EQUIPMENT
  const fetchEquipment = () => {
    axios
      .get("http://localhost:8080/equipment")
      .then((res) => setEquipment(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchEquipment();
    }
  }, [user]);

  // BLOCK NON ADMIN
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;

    try {
      await axios.delete(`http://localhost:8080/equipment/${id}`);
      fetchEquipment();

    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (item) => {
    setEditingItem(item);

    setFormData({
      name: item.name,
      price: item.price,
      availability: item.availability,
      quantity: item.quantity || 1
    });
  };

  // UPDATE EQUIPMENT
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {

      await axios.put(
        `http://localhost:8080/equipment/${editingItem.id}`,
        formData
      );

      alert("Equipment updated successfully");

      setEditingItem(null);

      fetchEquipment();

    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = async (id, newQuantity) => {

    if (newQuantity < 0) {
      newQuantity = 0;
    }

    try {

      await axios.put(
        `http://localhost:8080/equipment/${id}/quantity`,
        {
          quantity: newQuantity
        }
      );

      fetchEquipment();

    } catch (error) {
      console.error(error);
      alert("Quantity update failed");
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
            className="block w-full text-left px-4 py-3 rounded-xl bg-blue-600"
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
            onClick={() => navigate("/admin/users")}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800"
          >
            User Management
          </button>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10">

        <div className="flex justify-between items-center mb-10">

          <div>
            <h2 className="text-4xl font-bold">
              Equipment Management
            </h2>

            <p className="text-gray-500 mt-2">
              Manage all rental inventory
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/add-equipment")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            + Add Equipment
          </button>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-4">S.No</th>
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Price/Day</th>
                <th className="text-left p-4">Quantity</th>
                <th className="text-left p-4">Availability</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>

            <tbody>

              {equipment.map((item, index) => (

                <tr key={item.id} className="border-t">

                  <td className="p-4">
                    {index + 1}
                  </td>

                  {/* IMAGE */}
                  <td className="p-4">
                    <img
                      src={`http://localhost:8080/${item.imageUrl?.replace(
                        /^\/+/,
                        ""
                      )}`}
                      alt={item.name}
                      className="w-20 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = noImage;
                      }}
                    />
                  </td>

                  {/* NAME */}
                  <td className="p-4 font-semibold">
                    {item.name}
                  </td>

                  {/* PRICE */}
                  <td className="p-4">
                    ₹{item.price}
                  </td>

                  {/* QUANTITY */}
                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        className="bg-red-500 text-white w-8 h-8 rounded-full"
                      >
                        -
                      </button>

                      <span className="font-bold text-lg">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        className="bg-green-500 text-white w-8 h-8 rounded-full"
                      >
                        +
                      </button>

                    </div>

                  </td>

                  {/* AVAILABILITY */}
                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full ${
                        item.quantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.quantity > 0
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-2">

                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
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

        {/* EDIT MODAL */}
        {editingItem && (

          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

            <div className="bg-white p-8 rounded-3xl w-full max-w-lg">

              <h2 className="text-3xl font-bold mb-6">
                Edit Equipment
              </h2>

              <form
                onSubmit={handleUpdate}
                className="space-y-4"
              >

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                  }
                  className="w-full border p-4 rounded-xl"
                />

                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value
                    })
                  }
                  className="w-full border p-4 rounded-xl"
                />

                {/* QUANTITY */}
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: e.target.value
                    })
                  }
                  className="w-full border p-4 rounded-xl"
                />

                <div className="flex gap-4">

                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-300 py-3 rounded-xl"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>
    </div>
  );
}

export default AdminEquipment;