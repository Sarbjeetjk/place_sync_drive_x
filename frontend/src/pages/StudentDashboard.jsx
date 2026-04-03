import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', config);
      setJobs(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/student/me', config);
      setMyApplications(res.data);
    } catch (err) { console.error(err); }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/applications/${jobId}/apply`, {}, config);
      alert('Applied successfully!');
      fetchMyApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying');
    }
  };

  const hasApplied = (jobId) => {
    return myApplications.some(app => app.jobId._id === jobId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
            Available Jobs
          </h2>
          {jobs.length === 0 && <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">No jobs available right now.</p>}
          {jobs.map(job => (
            <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm font-medium text-indigo-600 mb-2">{job.companyId?.name}</p>
                </div>
                {hasApplied(job._id) ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" /> Applied
                  </span>
                ) : (
                  <button 
                    onClick={() => handleApply(job._id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Apply Now
                  </button>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold border border-indigo-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-indigo-500" />
            My Applications
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {myApplications.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">You haven't applied to any jobs yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {myApplications.map(app => (
                  <li key={app._id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-semibold text-gray-900">{app.jobId?.title}</span>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full font-medium ${app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
