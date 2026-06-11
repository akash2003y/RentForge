import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [bookings, setBookings] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
    // ✅ PAST BOOKINGS
  const today = new Date();
today.setHours(0, 0, 0, 0);

  // ✅ STABLE USER STATE (prevents infinite re-renders)
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ GET EQUIPMENT NAME FROM ID
  const getEquipmentName = (id) => {
    const equipment = equipmentList.find(
      (eq) => Number(eq.id) === Number(id)
    );

    // If deleted from equipment table
    return equipment ? equipment.name : "Deleted Equipment";
  };

  // ✅ LOAD PROFILE DATA ONLY ONCE
  useEffect(() => {
    if (!user?.email) return;

    const fetchProfileData = async () => {
      try {
        // Parallel fetch
        const [bookingRes, equipmentRes] = await Promise.all([
          axios.get("http://localhost:8080/bookings"),
          axios.get("http://localhost:8080/equipment"),
        ]);

        // Filter current user's bookings
        const userBookings = bookingRes.data.filter(
          (booking) => booking.email === user.email
        );

        setBookings(userBookings);
        setEquipmentList(equipmentRes.data);

      } catch (error) {
        console.error("Profile Fetch Error:", error);
      }
    };

    fetchProfileData();
  }, []); // ✅ EMPTY dependency = only once

  // ✅ CANCEL BOOKING
  const cancelBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/bookings/${id}`);

      setBookings((prevBookings) =>
  prevBookings.map((booking) =>
    booking.id === id
      ? { ...booking, status: "Cancelled" }
      : booking
  )
);

      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel Error:", error);
      alert("Failed to cancel booking");
    }
  };

  const activeBookings = bookings.filter((booking) => {
  const endDate = new Date(booking.endDate);
  endDate.setHours(0, 0, 0, 0);

  return (
    booking.status !== "Cancelled" &&
    booking.status !== "Completed" &&
    endDate >= today
  );
});



const pastBookings = bookings.filter((booking) => {
  const endDate = new Date(booking.endDate);
  endDate.setHours(0, 0, 0, 0);

  return (
    booking.status === "Cancelled" ||
    booking.status === "Completed" ||
    endDate < today
  );
});

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold mb-10">My Profile</h1>

      {/* USER CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* USER INFO */}
          <div className="flex items-center gap-5">
            <img
              src={
                user?.profilePic ||
                "https://via.placeholder.com/100?text=User"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div>
              <h2 className="text-2xl font-semibold">
                {user?.name || "Unknown User"}
              </h2>

              <p className="text-gray-600">
                {user?.email || "No Email"}
              </p>

              <p className="text-gray-600">
                {user?.phone || "N/A"}
              </p>

              <span className="inline-block mt-3 px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                {user?.role || "Customer"}
              </span>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-2xl font-bold text-blue-600">
                {bookings.length}
              </h3>
              <p className="text-sm text-gray-500">
                Total Bookings
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-2xl font-bold text-green-600">
                {activeBookings.length}
              </h3>
              <p className="text-sm text-gray-500">
                Active Rentals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE BOOKINGS */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-6">
          Active Bookings
        </h2>

        {activeBookings.length === 0 ? (
          <p className="text-gray-500">
            No active bookings
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border shadow-md p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {getEquipmentName(booking.equipmentId)}
                </h3>

                <p className="text-gray-600">
                  {booking.startDate} → {booking.endDate}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {booking.notes || "No notes provided"}
                </p>

                <p className={`mt-2 font-semibold ${
  booking.status === "Cancelled"
    ? "text-red-500"
    : booking.status === "Completed"
    ? "text-green-600"
    : "text-yellow-500"
}`}>
  Status: {booking.status}
</p>

                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BOOKING HISTORY */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          Booking History
        </h2>

        {pastBookings.length === 0 ? (
          <p className="text-gray-500">
            No previous bookings
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md border">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-4">
                    Equipment
                  </th>
                  <th className="text-left px-6 py-4">
                    Start Date
                  </th>
                  <th className="text-left px-6 py-4">
                    End Date
                  </th>
                  <th className="text-left px-6 py-4">
                    Status
                  </th>
                  <th className="text-left px-6 py-4">
                    Notes
                  </th>
                </tr>
              </thead>

              <tbody>
                {pastBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-t"
                  >
                    <td className="px-6 py-4">
                      {getEquipmentName(
                        booking.equipmentId
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {booking.startDate}
                    </td>

                    <td className="px-6 py-4">
                      {booking.endDate}
                    </td>

                    <td className={`px-6 py-4 font-medium ${
  (booking.status || "Completed") === "Cancelled"
    ? "text-red-500"
    : (booking.status || "Completed") === "Completed"
    ? "text-green-600"
    : "text-yellow-500"
}`}>
  {booking.status || "Completed"}
</td>

                    <td className="px-6 py-4">
                      {booking.notes || "No notes"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;