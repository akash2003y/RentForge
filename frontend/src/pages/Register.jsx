import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const patterns = {
    name: /^[A-Za-z ]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^.{6,}$/
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Live validation
    if (name === "name" && value && !patterns.name.test(value)) {
      setErrors(prev => ({ ...prev, name: "Enter valid full name" }));
    } else if (name === "name") {
      setErrors(prev => ({ ...prev, name: "" }));
    }

    if (name === "email" && value && !patterns.email.test(value)) {
      setErrors(prev => ({ ...prev, email: "Enter valid email" }));
    } else if (name === "email") {
      setErrors(prev => ({ ...prev, email: "" }));
    }

    if (name === "password" && value && !patterns.password.test(value)) {
      setErrors(prev => ({
        ...prev,
        password: "Password must be at least 6 characters"
      }));
    } else if (name === "password") {
      setErrors(prev => ({ ...prev, password: "" }));
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match"
        }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!patterns.name.test(formData.name)) {
      newErrors.name = "Enter valid full name";
    }

    if (!patterns.email.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!patterns.password.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await axios.post("http://localhost:8080/users/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "USER",
          provider: "LOCAL"
        });

        alert("Registration successful! Please login.");
        navigate("/login");

      } catch (error) {
        console.error("Registration Error:", error);
        alert("Registration failed. Email may already exist.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">

        {/* LOGO */}
        <h1 className="text-4xl font-bold text-center mb-3">
          <span className="text-black">Rent</span>
          <span className="text-blue-600">Forge</span>
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* FULL NAME */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
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
              className="w-full px-4 py-3 border rounded-xl"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Register
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;