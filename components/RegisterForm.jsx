import { useState } from 'react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Password before submission:", formData.password); // Log password for debugging

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
      } else {
        setMessage(data.error || 'Registration failed!');
      }
    } catch (error) {
      console.error("Error during registration:", error); // Add logging for better debugging
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md"
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full p-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-orange"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="w-full p-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-orange"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full p-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-orange"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-orange py-2 rounded text-white font-bold hover:bg-orange-600"
        >
          Register
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
