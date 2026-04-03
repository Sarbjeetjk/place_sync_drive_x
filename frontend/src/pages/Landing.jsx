import { Link, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Briefcase, Building, Zap, Shield, Search } from 'lucide-react';

export const Landing = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    if (user.role === 'student') return <Navigate to="/student-dashboard" replace />;
    if (user.role === 'company') return <Navigate to="/company-dashboard" replace />;
    if (user.role === 'institute') return <Navigate to="/institute-dashboard" replace />;
  }

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "AI Auto-Shortlisting",
      description: "Our proprietary smart-matching algorithm evaluates student skills against core job requirements, instantly shortlisting top candidates."
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      title: "Secure Role-Based Portals",
      description: "Dedicated dashboards for Students, Companies, and Institutes ensuring privacy and tailored workflows."
    },
    {
      icon: <Search className="w-6 h-6 text-indigo-500" />,
      title: "Seamless Hiring",
      description: "Companies can find the exact talent they need with 1-click filtering, while students apply to curated roles with ease."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            The Smartest Way to <span className="text-indigo-600">Connect Talent</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto mb-12">
            PlaceSync DriveX bridges the gap between ambitious students, top-tier companies, and leading institutes with AI-powered candidate pairing.
          </p>
        </div>
      </div>

      {/* Role Selection Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Choose Your Portal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Student Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">For Students</h3>
            <p className="mt-4 text-gray-600 mb-8 flex-grow">
              Build your unique profile, discover opportunities matching your exact skills, and get hired by top companies.
            </p>
            <div className="w-full flex space-x-3">
              <Link to="/login?role=student" className="w-1/2 flex justify-center py-3 px-4 border border-indigo-600 text-sm font-semibold rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors">
                Login
              </Link>
              <Link to="/register?role=student" className="w-1/2 flex justify-center py-3 px-4 bg-indigo-600 text-sm font-semibold rounded-xl text-white hover:bg-indigo-700 transition-colors shadow-md">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">For Companies</h3>
            <p className="mt-4 text-gray-600 mb-8 flex-grow">
              Post job requirements and let our AI engine instantly shortlist the perfect candidates for your roles.
            </p>
            <div className="w-full flex space-x-3">
              <Link to="/login?role=company" className="w-1/2 flex justify-center py-3 px-4 border border-emerald-600 text-sm font-semibold rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors">
                Login
              </Link>
              <Link to="/register?role=company" className="w-1/2 flex justify-center py-3 px-4 bg-emerald-600 text-sm font-semibold rounded-xl text-white hover:bg-emerald-700 transition-colors shadow-md">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Institute Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
              <Building className="w-10 h-10 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">For Institutes</h3>
            <p className="mt-4 text-gray-600 mb-8 flex-grow">
              Track your placement records, analyze company hiring trends, and oversee student success metrics.
            </p>
            <div className="w-full flex space-x-3">
              <Link to="/login?role=institute" className="w-1/2 flex justify-center py-3 px-4 border border-amber-600 text-sm font-semibold rounded-xl text-amber-600 hover:bg-amber-50 transition-colors">
                Login
              </Link>
              <Link to="/register?role=institute" className="w-1/2 flex justify-center py-3 px-4 bg-amber-500 text-sm font-semibold rounded-xl text-white hover:bg-amber-600 transition-colors shadow-md">
                Sign Up
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why PlaceSync?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-6 border border-gray-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
