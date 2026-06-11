import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Equipment() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [equipment, setEquipment] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [selectedItem, setSelectedItem] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [availableUnits, setAvailableUnits] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
    startDate: "",
    endDate: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  const patterns = {
    name: /^[A-Za-z ]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[6-9]\d{9}$/
  };

  // =========================
  // FETCH EQUIPMENT
  // =========================
  useEffect(() => {

    axios
      .get("http://localhost:8080/equipment")
      .then((res) => {

        setEquipment(res.data);

      })
      .catch((err) => console.error(err));

  }, []);

  // =========================
  // LIVE DATE AVAILABILITY
  // =========================
  useEffect(() => {

    const checkAvailability = async () => {

      if (
        !selectedItem ||
        !formData.startDate ||
        !formData.endDate
      ) {

        setAvailableUnits(null);

        return;
      }

      try {

        const response = await axios.get(

          `http://localhost:8080/bookings/availability/${selectedItem.id}`,

          {
            params: {
              startDate: formData.startDate,
              endDate: formData.endDate
            }
          }
        );

        setAvailableUnits(response.data);

      } catch (error) {

        console.error(
          "Availability check failed",
          error
        );
      }
    };

    checkAvailability();

  }, [
    formData.startDate,
    formData.endDate,
    selectedItem
  ]);

  // =========================
  // FILTER
  // =========================
  const filteredEquipment =
    equipment.filter(item => {

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        item.availability === filter;

      return matchesSearch &&
             matchesFilter;
    });

  // =========================
  // BOOK BUTTON
  // =========================
  const handleBook = (item) => {

    if (!user) {

      alert(
        "Please login first to book equipment"
      );

      navigate("/login");

      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: "",
      quantity: 1,
      startDate: "",
      endDate: "",
      notes: ""
    });

    setAvailableUnits(null);

    setSelectedItem(item);

    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {

    setShowModal(false);

    setSelectedItem(null);

    setAvailableUnits(null);

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      quantity: 1,
      startDate: "",
      endDate: "",
      notes: ""
    });

    setErrors({});
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    if (patterns[name]) {

      if (!patterns[name].test(value)) {

        setErrors(prev => ({
          ...prev,
          [name]: "Invalid " + name
        }));

      } else {

        setErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    }
  };

  // =========================
  // RENT CALCULATION
  // =========================
  const calculateTotalRent = () => {

    if (
      !formData.startDate ||
      !formData.endDate ||
      !selectedItem
    ) return 0;

    const start =
      new Date(formData.startDate);

    const end =
      new Date(formData.endDate);

    const diffTime = end - start;

    const diffDays =
      diffTime /
      (1000 * 60 * 60 * 24) + 1;

    if (diffDays <= 0) return 0;

    return (
      diffDays *
      selectedItem.price *
      formData.quantity
    );
  };

  // =========================
  // DEPOSIT CALCULATION
  // =========================
  const calculateDeposit = () => {

    if (!selectedItem) return 0;

    return (
      selectedItem.depositAmount *
      formData.quantity
    );
  };

  // =========================
  // GRAND TOTAL
  // =========================
  const calculateGrandTotal = () => {

    return (
      calculateTotalRent() +
      calculateDeposit()
    );
  };

  const handleSubmit = async () => {

  let newErrors = {};

  if (!patterns.name.test(formData.name)) {
    newErrors.name = "Enter valid name";
  }

  if (!patterns.email.test(formData.email)) {
    newErrors.email = "Enter valid email";
  }

  if (!patterns.phone.test(formData.phone)) {
    newErrors.phone = "Enter valid phone";
  }

  if (!formData.startDate || !formData.endDate) {
    newErrors.date = "Select dates";
  }

  if (formData.startDate > formData.endDate) {
    newErrors.date =
      "End date must be after start date";
  }

  if (formData.quantity <= 0) {
    newErrors.quantity =
      "Invalid quantity";
  }

  if (
    availableUnits !== null &&
    formData.quantity > availableUnits
  ) {

    newErrors.stock =
      `Only ${availableUnits} units available`;
  }

  setErrors(newErrors);

  if (
    Object.keys(newErrors).length === 0
  ) {

    try {

      // =========================
      // CASH BOOKING
      // =========================
      if (
        formData.paymentMethod === "CASH"
      ) {

        await axios.post(
          "http://localhost:8080/bookings",
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            quantity: Number(formData.quantity),
            startDate: formData.startDate,
            endDate: formData.endDate,
            notes: formData.notes,
            equipmentId: selectedItem.id,
            totalRent: calculateTotalRent(),
            depositAmount:
              calculateDeposit(),
            totalAmount:
              calculateGrandTotal(),
            paymentMethod: "CASH",
            status: "Pending Payment"
          }
        );

        setShowModal(false);

        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);

        return;
      }

      // =========================
      // ONLINE PAYMENT
      // =========================
      const orderResponse =
        await axios.post(

          "http://localhost:8080/payment/create-order",

          {
            amount:
              calculateGrandTotal()
          }
        );

      const orderData =
        orderResponse.data;

      const options = {

        key: "rzp_test_Snz3xJGXZ6i9Zv",

        amount: orderData.amount,

        currency: "INR",

        name: "RentForge",

        description:
          "Equipment Rental Payment",

        order_id: orderData.id,

        handler: async function () {

          try {

            await axios.post(
              "http://localhost:8080/bookings",
              {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                quantity:
                  Number(formData.quantity),
                startDate:
                  formData.startDate,
                endDate:
                  formData.endDate,
                notes: formData.notes,
                equipmentId:
                  selectedItem.id,
                totalRent:
                  calculateTotalRent(),
                depositAmount:
                  calculateDeposit(),
                totalAmount:
                  calculateGrandTotal(),
                paymentMethod:
                  "ONLINE",
                status: "Pending"
              }
            );

            setShowModal(false);

            setShowSuccess(true);

            setTimeout(() => {
              setShowSuccess(false);
            }, 2000);

          } catch (error) {

            console.error(error);

            alert(
              "Payment successful but booking failed"
            );
          }
        },

        prefill: {

          name: formData.name,

          email: formData.email,

          contact: formData.phone
        },

        theme: {
          color: "#2563eb"
        }
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.error(error);

      alert(
        "Booking failed"
      );
    }
  }
};

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  return (

    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">

        <h1 className="text-3xl font-semibold">
          Available Equipment
        </h1>

        <div className="flex gap-3 w-full md:w-auto">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full md:w-72 px-4 py-2 border rounded-lg"
          />

          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="px-3 py-2 border rounded-lg"
          >

            <option>All</option>

            <option>Available</option>

            <option>Unavailable</option>

          </select>

        </div>

      </div>

      {/* EQUIPMENT GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

        {filteredEquipment.map(item => (

          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >

            {/* IMAGE */}
            <div className="h-52 bg-gray-100 overflow-hidden">

              <img
                src={`http://localhost:8080/${item.imageUrl}`}
                alt={item.name}
                className="w-full h-full object-cover"
              />

            </div>

            {/* INFO */}
            <div className="p-5">

              <h3 className="font-semibold text-xl">
                {item.name}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                ₹{item.price}/day
              </p>

              <p className="text-sm text-orange-600 mt-1 font-medium">

                Deposit:
                ₹{item.depositAmount || 0}

              </p>

              <p className="text-sm font-medium mt-2">

                Total Units:

                <span className="ml-1 text-green-600">

                  {item.quantity}

                </span>

              </p>

              <button
                onClick={() =>
                  handleBook(item)
                }
                className="mt-4 w-full py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >

                Book Now

              </button>

            </div>

          </div>

        ))}

      </div>
{/* BOOKING MODAL */}
{showModal && selectedItem && (

  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4 py-6">

    <div className="bg-white rounded-2xl p-5 md:p-6 w-full max-w-[450px] max-h-[90vh] overflow-y-auto relative shadow-2xl">

      {/* CLOSE BUTTON */}
      <button
        onClick={closeModal}
        className="sticky top-0 ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-white shadow text-gray-500 hover:text-black z-10"
      >
        ✕
      </button>

      {/* HEADER */}
      <h2 className="text-2xl font-semibold mb-2">
        Book {selectedItem.name}
      </h2>

      <p className="text-sm text-gray-500 mb-1">
        ₹{selectedItem.price} per day
      </p>

      <p className="text-sm text-orange-600 mb-5 font-medium">
        Security Deposit:
        ₹{selectedItem.depositAmount || 0}
      </p>

      {/* FORM */}
      <div className="space-y-4">

        {/* NAME */}
        <div>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.name}
            </p>
          )}

        </div>

        {/* EMAIL */}
        <div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email}
            </p>
          )}

        </div>

        {/* PHONE */}
        <div>

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.phone}
            </p>
          )}

        </div>

        {/* QUANTITY */}
        <div>

          <label className="block text-sm font-medium mb-2">
            Select Quantity
          </label>

          <input
            type="number"
            name="quantity"
            min="1"
            max={
              availableUnits ||
              selectedItem.quantity
            }
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors.quantity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.quantity}
            </p>
          )}

        </div>


        {/* DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <input
            type="date"
            name="startDate"
            min={today}
            value={formData.startDate}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            name="endDate"
            min={
              formData.startDate ||
              today
            }
            value={formData.endDate}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {errors.date && (
          <p className="text-red-500 text-xs">
            {errors.date}
          </p>
        )}

        {/* LIVE AVAILABILITY */}
        {availableUnits !== null && (

          <div
            className={`p-3 rounded-xl text-sm font-medium ${
              availableUnits > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >

            {availableUnits > 0
              ? `Available Units: ${availableUnits} / ${selectedItem.quantity}`
              : "Unavailable for selected dates"}

          </div>

        )}

        {errors.stock && (
          <p className="text-red-500 text-xs">
            {errors.stock}
          </p>
        )}

        {/* PAYMENT METHOD */}
<div>

  <label className="block text-sm font-medium mb-3">
    Payment Method
  </label>

  <div className="flex gap-6">

    {/* ONLINE */}
    <label className="flex items-center gap-2 cursor-pointer">

      <input
        type="radio"
        name="paymentMethod"
        value="ONLINE"
        checked={
          formData.paymentMethod === "ONLINE"
        }
        onChange={handleChange}
      />

      <span>Online Payment</span>

    </label>

    {/* CASH */}
    <label className="flex items-center gap-2 cursor-pointer">

      <input
        type="radio"
        name="paymentMethod"
        value="CASH"
        checked={
          formData.paymentMethod === "CASH"
        }
        onChange={handleChange}
      />

      <span>Cash</span>

    </label>

  </div>

</div>

        {/* PAYMENT SUMMARY */}
        {formData.startDate &&
          formData.endDate && (

          <div className="bg-gray-100 rounded-2xl p-5 space-y-4">

            <div className="flex justify-between text-sm">

              <span className="text-gray-600">
                Rental Cost
              </span>

              <span className="font-medium">
                ₹{calculateTotalRent()}
              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-gray-600">
                Security Deposit
              </span>

              <span className="font-medium">
                ₹{calculateDeposit()}
              </span>

            </div>

            <hr />

            <div className="flex justify-between items-center">

              <span className="font-semibold">
                Total Payable
              </span>

              <span className="text-blue-600 font-bold text-2xl">

                ₹{calculateGrandTotal()}

              </span>

            </div>

            <p className="text-xs text-gray-500 leading-relaxed">

              Security deposit is refundable
              after equipment inspection.

            </p>

          </div>

        )}

        {/* NOTES */}
        <textarea
          name="notes"
          placeholder="Additional Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={availableUnits === 0}
          className={`w-full py-3 rounded-xl text-white font-medium transition ${
            availableUnits === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {availableUnits === 0
            ? "Unavailable"
            : "Confirm Booking"}
        </button>

      </div>

    </div>

  </div>

)}
      {/* SUCCESS MODAL */}
      {showSuccess && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">

          <div className="bg-white rounded-2xl p-8 text-center shadow-xl">

            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">

              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />

              </svg>

            </div>

            <h2 className="text-xl font-semibold">
              Booking Successful
            </h2>

          </div>

        </div>

      )}

    </div>
  );
}

export default Equipment;