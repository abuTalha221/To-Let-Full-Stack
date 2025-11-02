import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../../api'; // adjust path if needed
import Swal from 'sweetalert2'; // ✅ import SweetAlert2
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await api.post('/register', form);
      const token = res.data.token;

      // Save token & user info
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // ✅ SweetAlert success popup
      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Your account has been created successfully.',
        confirmButtonColor: '#e45716',
        confirmButtonText: 'Go to Login',
      });

      // ✅ Redirect after success
      navigate('/login');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors || {});
        } else {
          const message = err.response.data.message || 'Registration failed';
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed!',
            text: message,
            confirmButtonColor: '#e45716',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Network Error!',
          text: 'Unable to connect. Please try again later.',
          confirmButtonColor: '#e45716',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-5">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-8">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-800">Create an Account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please fill in the information below to register.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {errors.general && <div className="text-red-600">{errors.general}</div>}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e45716] focus:border-[#e45716]"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name[0]}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e45716] focus:border-[#e45716]"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email[0]}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e45716] focus:border-[#e45716]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password[0]}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e45716] focus:border-[#e45716]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#EC733B] to-[#e45716] hover:scale-105 duration-300 text-white py-2 px-6 rounded-full cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-[#e45716] hover:text-[#EC733B]">
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
