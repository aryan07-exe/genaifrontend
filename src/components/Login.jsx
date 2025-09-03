import React, { useState } from "react";
import axios from "axios";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ name: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/login", null, {
        params: form,
      });
      const user = { id: res.data.user_id, name: form.name };
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {["name", "password"].map((field) => (
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
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
