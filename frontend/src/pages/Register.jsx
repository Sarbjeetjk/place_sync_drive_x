import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Briefcase, GraduationCap, Building } from 'lucide-react';

export const Register = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role') || 'student';

  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: initialRole });
  const [error, setError] = useState('');
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await registerUser(formData.name, formData.email, formData.password, formData.role);
      if (user.role === 'student') navigate('/student-dashboard');
      if (user.role === 'company') navigate('/company-dashboard');
      if (user.role === 'institute') navigate('/institute-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl tracking-tight font-extrabold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join PlaceSync DriveX today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-md">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name / Company Name</label>
              <input
                required
                type="text"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Full-Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                required
                type="email"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                required
                type="password"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border-2 ${formData.role === 'student' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}>
                  <input type="radio" className="sr-only" name="role" value="student" checked={formData.role === 'student'} onChange={() => setFormData({ ...formData, role: 'student' })} />
                  <GraduationCap className={`w-6 h-6 mb-1 ${formData.role === 'student' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`text-xs font-semibold ${formData.role === 'student' ? 'text-indigo-700' : 'text-gray-500'}`}>Student</span>
                </label>

                <label className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border-2 ${formData.role === 'company' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}>
                  <input type="radio" className="sr-only" name="role" value="company" checked={formData.role === 'company'} onChange={() => setFormData({ ...formData, role: 'company' })} />
                  <Briefcase className={`w-6 h-6 mb-1 ${formData.role === 'company' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`text-xs font-semibold ${formData.role === 'company' ? 'text-indigo-700' : 'text-gray-500'}`}>Company</span>
                </label>

                <label className={`cursor-pointer flex flex-col items-center p-3 rounded-lg border-2 ${formData.role === 'institute' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}>
                  <input type="radio" className="sr-only" name="role" value="institute" checked={formData.role === 'institute'} onChange={() => setFormData({ ...formData, role: 'institute' })} />
                  <Building className={`w-6 h-6 mb-1 ${formData.role === 'institute' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`text-xs font-semibold ${formData.role === 'institute' ? 'text-indigo-700' : 'text-gray-500'}`}>Institute</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-md"
            >
              <UserPlus className="absolute left-4 w-5 h-5 text-indigo-300 group-hover:text-indigo-200" />
              Complete Registration
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
