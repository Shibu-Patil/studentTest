import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { loginStudent } from "../../slice/slice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.student);

  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = input.trim();
    if (!value) {
      toast.error("Email or Mobile number is required!");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^\d{10}$/;

    if (!emailPattern.test(value) && !mobilePattern.test(value)) {
      toast.error("Enter a valid email or 10-digit mobile number!");
      return;
    }

    // Detect type
    const payload = emailPattern.test(value)
      ? { email: value }
      : { mobileNumber: value };

    // Dispatch login and wait for result
    const resultAction = await dispatch(loginStudent(payload));

    if (loginStudent.fulfilled.match(resultAction)) {
      toast.success("Login successful!");
      navigate("/home"); // Navigate after successful login
    } else {
      toast.error(resultAction.payload || "Login failed!");
    }
  };

  const goToRegister = () => navigate("/register");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">


      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Email or Mobile Number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white ${
              loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
            } transition-colors`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            onClick={goToRegister}
            className="text-green-500 font-semibold hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
