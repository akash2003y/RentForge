import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AddEquipment() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    depositAmount: "",
    availability: "Available",
    quantity: 1
  });

  const [imageFile, setImageFile] = useState(null);

  // BLOCK NON ADMIN
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE IMAGE
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append("name", formData.name);

      data.append("price", formData.price);

      // SECURITY DEPOSIT
      data.append(
        "depositAmount",
        formData.depositAmount
      );

      data.append(
        "availability",
        formData.availability
      );

      data.append(
        "quantity",
        formData.quantity
      );

      data.append("image", imageFile);

      await axios.post(
        "http://localhost:8080/equipment/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Equipment added successfully 🚀");

      navigate("/admin/equipment");

    } catch (error) {

      console.error("Upload Error:", error);

      alert("Failed to add equipment");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mb-3">
          Add New Equipment
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Upload equipment professionally for your rental business
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* NAME */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Equipment Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter equipment name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

          </div>

          {/* RENT PRICE */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Rental Price Per Day (₹)
            </label>

            <input
              type="number"
              name="price"
              placeholder="Enter rental price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

          </div>

          {/* SECURITY DEPOSIT */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Security Deposit (₹)
            </label>

            <input
              type="number"
              name="depositAmount"
              placeholder="Enter refundable security deposit"
              value={formData.depositAmount}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

          </div>

          {/* QUANTITY */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Quantity Available
            </label>

            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Upload Equipment Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

          </div>

          {/* AVAILABILITY */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Availability
            </label>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            >
              <option value="Available">
                Available
              </option>

              <option value="Unavailable">
                Unavailable
              </option>

            </select>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
            >
              Add Equipment
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/equipment")
              }
              className="flex-1 bg-gray-300 py-3 rounded-xl hover:bg-gray-400"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddEquipment;