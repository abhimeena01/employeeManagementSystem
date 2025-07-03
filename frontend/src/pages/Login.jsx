import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data;

        // ✅ Set token and user in context
        login(user, token); // pass both to context login
        localStorage.setItem("token", token);

        // ✅ Redirect based on role
        if (user.role === "admin") {
          navigate('/admin-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 to-gray-100 space-y-6">
      <h2 className="font-pacific text-3xl text-white">Employee Management System</h2>
      <div className="border shadow p-6 w-80 bg-white rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && (
          <p className="text-red-600 text-sm font-medium mb-2 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor='email' className="block text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder='Enter Email'
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor='password' className="block text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder='********'
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-teal-600 text-sm">Forgot password?</a>
          </div>

          <div className="mb-4">
            <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
