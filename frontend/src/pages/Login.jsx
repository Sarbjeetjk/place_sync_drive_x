import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LogIn, UserPlus } from 'lucide-react';

export const Login = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roleQuery = searchParams.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'student') navigate('/student-dashboard');
      if (user.role === 'company') navigate('/company-dashboard');
      if (user.role === 'institute') navigate('/institute-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const seedDB = async () => {
    try {
      await axios.post('http://localhost:5000/api/seed');
      alert('Database Seeded Successfully! You can now login.');
    } catch (err) {
      alert('Seed failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl tracking-tight font-extrabold text-gray-900">
            {roleQuery ? `Sign in to the ${roleQuery.charAt(0).toUpperCase() + roleQuery.slice(1)} Portal` : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to PlaceSync DriveX
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-md">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md"
            >
              <LogIn className="absolute left-4 w-5 h-5 text-indigo-300 group-hover:text-indigo-200" />
              Sign In
            </button>
          </div>
        </form>
        
        <div className="mt-6 flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-4">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign up here
            </Link>
          </p>
          <div className="w-full border-t border-gray-200 mb-4"></div>
          <p className="text-xs text-gray-500 mb-2">Demo usage: student@example.com / company@example.com / institute@example.com (pw: password123)</p>
          <button onClick={seedDB} className="text-sm px-4 py-2 border-2 border-emerald-500 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors">
            Init Demo Database (Seed)
          </button>
        </div>
      </div>
    </div>
  );
};
