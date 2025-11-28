import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerStudent } from "../../slice/slice";
import toast from "react-hot-toast";

const StudentRegistration = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.student);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    batchCode: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    const { name, email, mobileNumber, batchCode } = form;
    
    
    if (!name && !email && !mobileNumber && !batchCode) {
        console.log("hiii");
      toast.error("All fields are required!");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      toast.error("Mobile number must be 10 digits!");
      return;
    }

    dispatch(registerStudent({ name, email, mobileNumber, batchCode })).then((res) => {
      if (res.type === "student/registerStudent/fulfilled") {
        setForm({ name: "", email: "", mobileNumber: "", batchCode: "" });
        toast.success("Student registered successfully!");
      } else if (res.type === "student/registerStudent/rejected") {
        toast.error(res.payload);
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Student Registration</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="batchCode"
            value={form.batchCode}
            onChange={handleChange}
            placeholder="Batch Code"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full p-2 rounded-md text-white ${
              loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
            } transition-colors`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
