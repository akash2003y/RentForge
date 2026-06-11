import { useEffect, useState } from "react";
import axios from "axios";
import equipmentImg from "../assets/equipment.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const [equipment, setEquipment] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/equipment")
      .then((res) => setEquipment(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full bg-white">
      {/* HERO */}
      <section className="w-full bg-gray-100">
        <div className="w-full px-10 md:px-16 lg:px-24 xl:px-32 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight max-w-2xl">
              Smart Equipment Rental
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
              Manage construction equipment, track availability, and handle
              rentals efficiently with RentForge’s enterprise-grade platform.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/equipment")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Explore Equipment
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-white transition"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div>
            <img
              src={equipmentImg}
              alt="Equipment Rental"
              className="w-full max-w-2xl rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full py-20">
        <div className="w-full px-10 md:px-16 lg:px-24 xl:px-32">
          <h2 className="text-4xl font-bold text-center mb-14">
            Why Choose RentForge?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <h3 className="text-2xl font-semibold mb-3">
                Real-time Availability
              </h3>

              <p className="text-gray-600">
                Track equipment availability instantly across your rental
                ecosystem.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <h3 className="text-2xl font-semibold mb-3">Easy Booking</h3>

              <p className="text-gray-600">
                Book machinery in just a few clicks with streamlined workflows.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <h3 className="text-2xl font-semibold mb-3">
                Secure Management
              </h3>

              <p className="text-gray-600">
                Enterprise-grade rental management with secure customer
                handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="w-full bg-blue-600 text-white py-16">
        <div className="w-full px-10 md:px-16 lg:px-24 xl:px-32 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h2 className="text-5xl font-bold">100+</h2>
            <p className="mt-2">Active Users</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold">50+</h2>
            <p className="mt-2">Equipment Listed</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold">24/7</h2>
            <p className="mt-2">Support</p>
          </div>
        </div>
      </section>

      {/* FEATURED EQUIPMENT */}
      <section className="w-full bg-gray-50 py-20">
        <div className="w-full px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Featured Equipment</h2>

            <button
              onClick={() => navigate("/equipment")}
              className="text-blue-600 font-semibold text-lg"
            >
              View All →
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipment.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={`http://localhost:8080/${item.imageUrl}`}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-semibold">{item.name}</h3>

                  <p className="text-gray-500 mt-1">
                    ₹{item.price}/day
                  </p>

                  <button
                    onClick={() => navigate("/equipment")}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-black text-gray-300 pt-20 pb-10 mt-auto">
        <div className="w-full px-10 md:px-16 lg:px-24 xl:px-32">
          {/* CTA */}
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to simplify rentals?
            </h2>

            <p className="text-lg text-gray-400 mb-6">
              Join RentForge and modernize your construction rental workflow.
            </p>

            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started Today
            </button>
          </div>

          {/* FOOTER GRID */}
          <div className="grid md:grid-cols-3 gap-12 border-t border-gray-800 pt-10">
            {/* BRAND */}
            <div>
              <button
                onClick={() => navigate("/")}
                className="text-white text-2xl font-bold mb-4 hover:text-blue-500 transition"
              >
                RentForge
              </button>

              <p className="mt-2 text-gray-400 leading-relaxed">
                Smart equipment rental platform for modern businesses.
              </p>
            </div>

            {/* PLATFORM */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/")}
                  className="block hover:text-blue-500 transition"
                >
                  Home
                </button>

                <button
                  onClick={() => navigate("/equipment")}
                  className="block hover:text-blue-500 transition"
                >
                  Equipment
                </button>

                
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>

              <div className="space-y-3">
                <a
                  href="mailto:support@rentforge.com"
                  className="block hover:text-blue-500 transition"
                >
                  support@rentforge.com
                </a>

                <a
                  href="tel:+919876543210"
                  className="block hover:text-blue-500 transition"
                >
                  +91 9876543210
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;