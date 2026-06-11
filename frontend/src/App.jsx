import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Home from "./pages/Home";
import Equipment from "./pages/Equipment";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import AdminEquipment from "./pages/AdminEquipment";
import AddEquipment from "./pages/AddEquipment";
import AdminBookings from "./pages/AdminBookings";
import AdminUsers from "./pages/AdminUsers";

// NEW
import BookingHistory from "./pages/BookingHistory";

// APP CONTENT
function AppContent() {

  const location = useLocation();

  // CHECK ADMIN ROUTE
  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (

    <div className="bg-gray-50 min-h-screen">

      {/* USER NAVBAR */}
      {!isAdminRoute && <Navbar />}

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />

        <Route
          path="/equipment"
          element={<Equipment />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* USER */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* NEW */}
        <Route
          path="/my-bookings"
          element={<BookingHistory />}
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/equipment"
          element={<AdminEquipment />}
        />

        <Route
          path="/admin/add-equipment"
          element={<AddEquipment />}
        />

        <Route
          path="/admin/bookings"
          element={<AdminBookings />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

      </Routes>

    </div>
  );
}

// MAIN APP
function App() {

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;