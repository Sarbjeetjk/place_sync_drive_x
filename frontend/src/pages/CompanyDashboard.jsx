import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users, Zap, Search } from 'lucide-react';

export const CompanyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({}); // { jobId: [apps] }
  const [newJob, setNewJob] = useState({ title: '', description: '', requiredSkills: '' });
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', config);
      setJobs(res.data);
      res.data.forEach(job => fetchApplications(job._id));
    } catch (err) { console.error(err); }
  };

  const fetchApplications = async (jobId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/${jobId}`, config);
      setApplications(prev => ({ ...prev, [jobId]: res.data }));
    } catch (err) { console.error(err); }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = newJob.requiredSkills.split(',').map(s => s.trim()).filter(s => s);
      await axios.post('http://localhost:5000/api/jobs', { ...newJob, requiredSkills: skillsArray }, config);
      setShowForm(false);
      setNewJob({ title: '', description: '', requiredSkills: '' });
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating job');
    }
  };

  const handleAutoShortlist = async (jobId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/jobs/${jobId}/auto-shortlist`, {}, config);
      alert(res.data.message);
      fetchApplications(jobId);
    } catch (err) {
      alert(err.response?.data?.message || 'Error auto shortlisting');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8 max-w-2xl">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Job Posting</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input 
                required type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="e.g. Frontend Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea 
                required rows="3" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
              <input 
                required type="text" value={newJob.requiredSkills} onChange={e => setNewJob({...newJob, requiredSkills: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="React, Node.js, Tailwind CSS"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Post Job</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {jobs.length === 0 && <p className="text-gray-500">No jobs posted yet.</p>}
        {jobs.map(job => (
          <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="bg-white text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-gray-200 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleAutoShortlist(job._id)}
                className="flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 mr-2" />
                AI Auto-Shortlist (≥80%)
              </button>
            </div>
            
            <div className="p-6">
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center uppercase tracking-wider">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                Applicants ({applications[job._id]?.length || 0})
              </h4>
              
              {applications[job._id]?.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No applications yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {applications[job._id]?.map(app => (
                        <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{app.studentId?.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{app.studentId?.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">{app.matchScore.toFixed(0)}%</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              app.status === 'shortlisted' ? 'bg-green-100 text-green-800' : 
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
