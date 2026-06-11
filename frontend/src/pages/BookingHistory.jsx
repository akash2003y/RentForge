import { useEffect, useState } from "react";

import axios from "axios";

import { useAuth } from "../context/AuthContext";

function BookingHistory() {

  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);

  const [equipmentMap, setEquipmentMap] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    if (!user?.email) return;

    const fetchData = async () => {

      try {

        // BOOKINGS
        const bookingRes =
          await axios.get(

            `http://localhost:8080/bookings/user/${user.email}`
          );

        setBookings(bookingRes.data);

        // EQUIPMENT
        const equipmentRes =
          await axios.get(
            "http://localhost:8080/equipment"
          );

        // CREATE MAP
        const map = {};

        equipmentRes.data.forEach(item => {

          map[item.id] = item;
        });

        setEquipmentMap(map);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    fetchData();

  }, [user]);

  // =========================
  // STATUS COLORS
  // =========================
  const getStatusColor = (status) => {

    switch (status) {

      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (

    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-800">
          My Bookings
        </h1>

        <p className="text-gray-500 mt-2">
          Track all your rentals and payments
        </p>

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="text-center py-20 text-gray-500">
          Loading bookings...
        </div>

      ) : bookings.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-md p-12 text-center">

          <h2 className="text-2xl font-semibold text-gray-700">
            No bookings found
          </h2>

          <p className="text-gray-500 mt-3">
            You haven't booked any equipment yet.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {bookings.map((booking) => {

            const equipment =
              equipmentMap[booking.equipmentId];

            return (

              <div
                key={booking.id}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden border"
              >

                {/* EQUIPMENT IMAGE */}
                {equipment?.imageUrl && (

                  <img
                    src={`http://localhost:8080/${equipment.imageUrl}`}
                    alt={equipment.name}
                    className="w-full h-52 object-cover"
                  />

                )}

                {/* CONTENT */}
                <div className="p-6">

                  {/* TOP */}
                  <div className="flex justify-between items-start mb-5">

                    <div>

                      <h2 className="text-2xl font-semibold text-gray-800">

                        {equipment?.name ||
                          `Equipment #${booking.equipmentId}`}

                      </h2>

                      <p className="text-sm text-gray-500 mt-1">

                        Booking ID:
                        {" "}
                        #{booking.id}

                      </p>

                    </div>

                    {/* STATUS */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}
                    >

                      {booking.status}

                    </span>

                  </div>

                  {/* DETAILS */}
                  <div className="space-y-3">

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Rental Dates
                      </span>

                      <span className="font-medium text-right">

                        {booking.startDate}
                        {" → "}
                        {booking.endDate}

                      </span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Quantity
                      </span>

                      <span className="font-medium">

                        {booking.quantity}

                      </span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Price / Day
                      </span>

                      <span className="font-medium">

                        ₹{equipment?.price || 0}

                      </span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Rental Cost
                      </span>

                      <span className="font-medium">

                        ₹{booking.totalRent}

                      </span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span className="text-gray-500">
                        Security Deposit
                      </span>

                      <span className="font-medium">

                        ₹{booking.depositAmount}

                      </span>

                    </div>

                  </div>

                  <hr className="my-5" />

                  {/* TOTAL */}
                  <div className="flex justify-between items-center">

                    <span className="font-semibold text-gray-700">
                      Total Paid
                    </span>

                    <span className="text-3xl font-bold text-blue-600">

                      ₹{booking.totalAmount}

                    </span>

                  </div>

                  {/* NOTES */}
                  {booking.notes && (

                    <div className="bg-gray-100 rounded-2xl p-4 mt-5">

                      <p className="text-xs text-gray-500 mb-1">
                        Notes
                      </p>

                      <p className="text-sm text-gray-700">
                        {booking.notes}
                      </p>

                    </div>

                  )}

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default BookingHistory;