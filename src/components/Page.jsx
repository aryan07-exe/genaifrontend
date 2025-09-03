import React, { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    craft: "",
    location: "",
    experience: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://genaibackend-r809.onrender.com/register", null, {
        params: form, // FastAPI is expecting query/form params, not JSON body
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Error registering user");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {["name", "craft", "location", "experience", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
            required
          />
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
