import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Users, Zap, Briefcase, CheckCircle, 
  Video, MessageSquare, Calendar, Building, Search, Archive
} from 'lucide-react';

export const CompanyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('jobs');
  
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({}); // { jobId: [apps] }
  const [newJob, setNewJob] = useState({ title: '', description: '', requiredSkills: '' });
  const [searchQuery, setSearchQuery] = useState('');

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
      setNewJob({ title: '', description: '', requiredSkills: '' });
      alert('Job posted successfully!');
      fetchJobs();
      setActiveTab('jobs');
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

  const handleUpdateStatus = async (appId, jobId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: newStatus }, config);
      fetchApplications(jobId);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  // Aggregation for global tables
  const allCandidates = Object.values(applications).flat();
  const pendingCandidates = allCandidates.filter(app => app.status === 'applied');
  const shortlistedCandidates = allCandidates.filter(app => app.status === 'shortlisted');
  const interviewCandidates = allCandidates.filter(app => app.status === 'interview');
  const rejectedCandidates = allCandidates.filter(app => app.status === 'rejected');

  // Search filter applied to the main review pool (pending)
  const filteredCandidates = pendingCandidates.filter(app => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (app.studentId?.name || '').toLowerCase();
    const email = (app.studentId?.email || '').toLowerCase();
    
    // Attempt lookup for job title if possible
    const job = jobs.find(j => j._id === (app.jobId?._id || app.jobId));
    const role = (job?.title || app.jobId?.title || '').toLowerCase();
    
    return name.includes(q) || email.includes(q) || role.includes(q);
  });

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      
      {/* 20% Sidebar */}
      <aside className="w-1/5 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm z-10 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
        <div className="w-full px-4 mb-6">
          <div className="flex items-center space-x-2 text-gray-900 font-bold px-4 py-2 border-b border-gray-100">
            <Building className="w-5 h-5 text-indigo-600" />
            <span className="truncate">{user?.name} Portal</span>
          </div>
        </div>

        <nav className="w-full px-4 space-y-1">
          <SidebarButton id="new-job" icon={<Plus />} label="New Job" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarButton id="jobs" icon={<Briefcase />} label="Jobs List" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarButton id="candidates" icon={<Users />} label="Candidates (To Review)" activeTab={activeTab} setActiveTab={setActiveTab} badge={pendingCandidates.length} />
          <SidebarButton id="shortlisted" icon={<CheckCircle />} label="Shortlisted" activeTab={activeTab} setActiveTab={setActiveTab} badge={shortlistedCandidates.length} />
          <SidebarButton id="bin" icon={<Archive />} label="Bin" activeTab={activeTab} setActiveTab={setActiveTab} badge={rejectedCandidates.length} />
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
          </div>
          <SidebarButton id="interview" icon={<Video />} label="Interviews" activeTab={activeTab} setActiveTab={setActiveTab} badge={interviewCandidates.length > 0 ? interviewCandidates.length : undefined} />
        </nav>
      </aside>

      {/* 80% Main Content Area */}
      <main className="w-4/5 p-8 overflow-y-auto">
        
        {/* TAB: NEW JOB */}
        {activeTab === 'new-job' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
              <p className="text-gray-500 text-sm mt-1">Fill out the job details below. Candidates matching ≥80% of skills can be auto-shortlisted.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <form onSubmit={handleCreateJob} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                  <input 
                    required type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
                  <textarea 
                    required rows="5" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Describe the responsibilities and requirements..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills (Comma separated)</label>
                  <input 
                    required type="text" value={newJob.requiredSkills} onChange={e => setNewJob({...newJob, requiredSkills: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="React, Node.js, TypeScript, AWS"
                  />
                  <p className="text-xs text-gray-400 mt-1">Our AI uses these exact skills to calculate match scores.</p>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md">
                    <Plus className="w-5 h-5 mr-2" /> Publish Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB: JOBS */}
        {activeTab === 'jobs' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              Active Listings ({jobs.length})
            </h2>
            <div className="space-y-6">
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
                      AI Auto-Shortlist Set
                    </button>
                  </div>
                  
                  <div className="p-6 bg-white">
                    <p className="text-gray-600 text-sm">{job.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-sm font-semibold text-gray-500">
                      <Users className="w-4 h-4 mr-2 text-indigo-500" />
                      Total Candidates Applied: <span className="ml-1 text-gray-900">{applications[job._id]?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CANDIDATES */}
        {activeTab === 'candidates' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                Global Candidate Pool
              </h2>
              <div className="relative w-full sm:w-80">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or role..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
                />
              </div>
            </div>
            {filteredCandidates.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                  {searchQuery ? "No candidates found matching your search." : "No candidates have applied to your jobs yet."}
                </div>
            ) : (
                <CandidateList candidates={filteredCandidates} jobs={jobs} onUpdateStatus={handleUpdateStatus} />
            )}
          </div>
        )}

        {/* TAB: SHORTLISTED */}
        {activeTab === 'shortlisted' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-emerald-500" />
                  Shortlisted Candidates
                </h2>
                <p className="text-gray-500 text-sm mt-1">Candidates who met or exceeded the 80% AI match threshold.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
              {shortlistedCandidates.length === 0 ? (
                <div className="p-12 text-center text-gray-500">No candidates have been shortlisted yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Score</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shortlistedCandidates.map((app, idx) => {
                        const job = jobs.find(j => j._id === (app.jobId?._id || app.jobId));
                        const jobTitle = job?.title || app.jobId?.title || 'Unknown Job';

                        return (
                        <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">{app.studentId?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{app.studentId?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                           {jobTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md border border-emerald-200">
                              {app.matchScore.toFixed(0)}% MATCH
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button className="text-indigo-600 hover:text-indigo-900 font-semibold bg-indigo-50 px-3 py-1.5 rounded-lg mr-2 transition-colors">View</button>
                            <button 
                              onClick={() => handleUpdateStatus(app._id, app.jobId?._id || app.jobId, 'rejected')}
                              className="text-rose-600 hover:text-white font-semibold bg-rose-50 hover:bg-rose-500 px-3 py-1.5 rounded-lg mr-2 transition-colors"
                            >
                              Dislike
                            </button>
                            <button 
                              onClick={() => {
                                 handleUpdateStatus(app._id, app.jobId?._id || app.jobId, 'interview');
                                 setActiveTab('interview');
                              }}
                              className="text-white font-semibold bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                            >Schedule</button>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: BIN */}
        {activeTab === 'bin' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Archive className="w-6 h-6 mr-2 text-rose-500" />
                  Bin (Rejected)
                </h2>
                <p className="text-gray-500 text-sm mt-1">Candidates who did not meet the role requirements.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
              {rejectedCandidates.length === 0 ? (
                <div className="p-12 text-center text-gray-500">The bin is empty.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Score</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rejectedCandidates.map((app, idx) => {
                        const job = jobs.find(j => j._id === (app.jobId?._id || app.jobId));
                        const jobTitle = job?.title || app.jobId?.title || 'Unknown Job';

                        return (
                        <tr key={idx} className="hover:bg-rose-50/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">{app.studentId?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{app.studentId?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                           {jobTitle}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded-md border border-gray-200">
                              {app.matchScore.toFixed(0)}% MATCH
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button className="text-gray-600 hover:text-gray-900 font-semibold bg-gray-50 px-3 py-1.5 rounded-lg mr-2 transition-colors">View Profile</button>
                            <button 
                              onClick={() => handleUpdateStatus(app._id, app.jobId?._id || app.jobId, 'applied')}
                              className="text-white font-semibold bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                            >
                              Restore
                            </button>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: INTERVIEW PLACEHOLDER */}
        {activeTab === 'interview' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Video className="w-6 h-6 mr-2 text-indigo-500" />
                  Scheduled Interviews
                </h2>
                <p className="text-gray-500 text-sm mt-1">Candidates allotted for HR interviews.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {interviewCandidates.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">No interviews scheduled.</div>
              ) : (
                interviewCandidates.map((app, idx) => {
                  const job = jobs.find(j => j._id === (app.jobId?._id || app.jobId));
                  const jobTitle = job?.title || app.jobId?.title || 'Unknown Job';

                  return (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold border border-indigo-100 flex-shrink-0">
                            {(app.studentId?.name || 'C').charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{app.studentId?.name || 'Unknown Candidate'}</h3>
                            <p className="text-sm font-medium text-indigo-600">{jobTitle}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
                              HR Allotted: Sarah Miller (Technical Recruiter)
                            </p>
                          </div>
                       </div>
                       
                       <div className="flex gap-3 mt-4 md:mt-0">
                          <button className="flex items-center text-indigo-600 font-semibold px-4 py-2 rounded-lg text-sm bg-indigo-50 shadow-sm transition-colors hover:bg-indigo-100">
                             <Calendar className="w-4 h-4 mr-2" /> Feb 12, 10:00 AM
                          </button>
                          <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md transition-colors">
                             <Video className="w-4 h-4 mr-2" /> Join Call
                          </button>
                       </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

// --- Sub Components ---

const SidebarButton = ({ id, icon, label, activeTab, setActiveTab, badge }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className={`w-5 h-5 ${isActive ? 'text-indigo-100' : 'text-gray-400'}`}>
          {icon}
        </span>
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
          {badge}
        </span>
      )}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  if (status === 'shortlisted') return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Shortlisted</span>;
  if (status === 'interview') return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">Scheduled</span>;
  if (status === 'rejected') return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
  return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Applied</span>;
};

const PlaceholderView = ({ icon, title, subtitle }) => (
  <div className="h-full flex items-center justify-center pt-20">
    <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg mx-auto">
      <div className="flex justify-center">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>
      <button className="mt-8 px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors">
        Notify me when available
      </button>
    </div>
  </div>
);

const CandidateList = ({ candidates, jobs, onUpdateStatus }) => {
  return (
    <div className="w-full py-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-500 mb-6 uppercase tracking-widest text-center w-full">
        Reviewing {candidates.length} candidates
      </h3>
      
      <div className="w-full flex justify-center pb-10">
        <div className="w-full flex flex-col space-y-4">
          {candidates.map((app) => {
            const job = jobs.find(j => j._id === (app.jobId?._id || app.jobId));
            const jobTitle = job?.title || app.jobId?.title || 'Unknown Job';
            const jobId = job?._id || app.jobId?._id || app.jobId;

            return (
            <div key={app._id} className="w-full flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Left Aesthetic Bar */}
              <div className="w-full md:w-2 bg-gradient-to-b from-indigo-500 to-purple-600 h-2 md:h-auto"></div>

              <div className="flex flex-col md:flex-row w-full px-6 py-5 items-center md:items-stretch gap-6">
                {/* User Initial Circle */}
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner flex-shrink-0 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                  {(app.studentId?.name || 'A').charAt(0).toUpperCase()}
                </div>

                {/* Identity Box */}
                <div className="flex-grow flex flex-col justify-center text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {app.studentId?.name || 'Unknown Candidate'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {app.studentId?.email}
                  </p>
                </div>

                {/* Details Data Box */}
                <div className="w-full md:w-auto bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row items-center md:items-center gap-6 flex-shrink-0 group-hover:bg-white transition-colors">
                  <div className="text-center md:text-left min-w-[140px] max-w-[200px]">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Applied Role
                    </p>
                    <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                      {jobTitle}
                    </p>
                  </div>

                  <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-0.5">Match</p>
                      <p className={`text-lg font-black ${app.matchScore >= 80 ? 'text-emerald-500' : 'text-indigo-600'}`}>
                        {app.matchScore.toFixed(0)}%
                      </p>
                    </div>
                    <div className="min-w-[90px] text-right">
                      <StatusBadge status={app.status} />
                    </div>
                    
                    <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                    <div className="flex gap-2">
                       <button 
                         onClick={() => onUpdateStatus(app._id, jobId, 'shortlisted')}
                         className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                         title="Approve / Shortlist"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                       </button>
                       <button 
                         onClick={() => onUpdateStatus(app._id, jobId, 'rejected')}
                         className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                         title="Reject Candidate"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};
