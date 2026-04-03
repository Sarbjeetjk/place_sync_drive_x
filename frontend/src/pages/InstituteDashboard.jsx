import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Building, Activity, Briefcase, GraduationCap } from 'lucide-react';

export const InstituteDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ jobs: 0, users: 0, pendingApps: 0 });
  const [activeTab, setActiveTab] = useState('overview'); // overview, jobs, users, applications
  
  const [dataJobs, setDataJobs] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [dataApps, setDataApps] = useState([]);

  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
  const config = { headers: { Authorization: `Bearer ${token}` } };
  
  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'applications') fetchApps();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/institute/stats', config);
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/institute/jobs', config);
      setDataJobs(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/institute/users', config);
      setDataUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchApps = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/institute/applications', config);
      setDataApps(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Institute Overview</h1>
          <p className="mt-2 text-sm text-gray-600 font-medium tracking-wide">PlaceSync DriveX Analytics & Reporting</p>
        </div>
        {activeTab !== 'overview' && (
          <button 
            onClick={() => setActiveTab('overview')} 
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            ← Back to Overview
          </button>
        )}
      </div>

      {/* Cards serving as Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          onClick={() => setActiveTab('jobs')}
          className={`cursor-pointer p-6 rounded-2xl shadow-sm border transition-all ${activeTab === 'jobs' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:border-indigo-100 hover:-translate-y-1'} flex items-center space-x-4`}
        >
          <div className="p-4 bg-indigo-100 rounded-xl text-indigo-600">
            <Building className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Job Postings</p>
            <h2 className="text-3xl font-extrabold text-gray-900">{stats.jobs}</h2>
          </div>
        </div>
        
        <div 
          onClick={() => setActiveTab('users')}
          className={`cursor-pointer p-6 rounded-2xl shadow-sm border transition-all ${activeTab === 'users' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100 hover:border-emerald-100 hover:-translate-y-1'} flex items-center space-x-4`}
        >
          <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
            <h2 className="text-3xl font-extrabold text-gray-900">{stats.users}</h2>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('applications')}
          className={`cursor-pointer p-6 rounded-2xl shadow-sm border transition-all ${activeTab === 'applications' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100 hover:border-amber-100 hover:-translate-y-1'} flex items-center space-x-4`}
        >
          <div className="p-4 bg-amber-100 rounded-xl text-amber-600">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Applications Processed</p>
            <h2 className="text-3xl font-extrabold text-gray-900">{stats.pendingApps}</h2>
          </div>
        </div>
      </div>

      {/* Conditional Rendering of Content beneath */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {activeTab === 'overview' && (
          <div className="p-12 text-center">
            <Activity className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Select a metric card above to view details</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Click on Active Job Postings, Total Users, or Applications to drill down into specific database tables.
            </p>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Building className="w-5 h-5 mr-2 text-indigo-500"/> System Job Postings</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Skills</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataJobs.map(job => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{job.companyId?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{job.requiredSkills.join(', ')}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Users className="w-5 h-5 mr-2 text-emerald-500"/> Registered Platform Users</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataUsers.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${u.role === 'institute' ? 'bg-amber-100 text-amber-800' : 
                            u.role === 'company' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-amber-500"/> System Activity (Applications)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Applied</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculated Match Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataApps.map(app => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{app.jobId?.title || 'Unknown Job'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{app.studentId?.name || 'Unknown User'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-700">{app.matchScore.toFixed(0)}%</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full 
                          ${app.status === 'shortlisted' ? 'bg-green-100 text-green-800' : 
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
