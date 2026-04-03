import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Users, Building, Activity, Briefcase, GraduationCap, 
  Calendar, ClipboardList, Bell, BarChart2 
} from 'lucide-react';

const DashboardCard = ({ icon, title, desc, btnText, onClick, theme, secondaryBtnText, onSecondaryClick }) => {
  const themes = {
    indigo: { icon: "text-indigo-500", btn: "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-600 hover:text-white" },
    emerald: { icon: "text-emerald-500", btn: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-600 hover:text-white" },
    amber: { icon: "text-amber-500", btn: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-600 hover:text-white" },
    rose: { icon: "text-rose-500", btn: "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-600 hover:text-white" },
    sky: { icon: "text-sky-500", btn: "bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-600 hover:text-white" },
    purple: { icon: "text-purple-500", btn: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-600 hover:text-white" }
  };
  const t = themes[theme] || themes.indigo;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group hover:border-indigo-100">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className={t.icon}>
            {icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">
          {desc}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={onClick}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-colors shadow-sm w-max flex-1 text-center justify-center ${t.btn}`}
        >
          {btnText}
        </button>
        {secondaryBtnText && (
          <button 
            onClick={onSecondaryClick}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-colors shadow-sm w-max flex-1 text-center justify-center bg-white text-gray-700 border-gray-200 hover:bg-gray-50`}
          >
            {secondaryBtnText}
          </button>
        )}
      </div>
    </div>
  );
};

export const InstituteDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ jobs: 0, users: 0, companies: 0, pendingApps: 0, topCompanies: [] });
  const [activeTab, setActiveTab] = useState('overview'); // overview, jobs, users, applications
  
  const [dataJobs, setDataJobs] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [dataApps, setDataApps] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [newDrive, setNewDrive] = useState({ companyId: '', title: '', shortDesc: '', packageStr: '', date: '', eligibility: 'CGPA > 7' });

  const [eligibility, setEligibility] = useState(() => {
    const saved = localStorage.getItem('institute_eligibility');
    return saved ? JSON.parse(saved) : { cgpa: 7.0, branches: ['CSE', 'IT'], skills: ['Java', 'DSA'] };
  });
  const [newSkill, setNewSkill] = useState('');
  const [notificationMsg, setNotificationMsg] = useState({ title: '', message: '', target: 'all' });

  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';
  const config = { headers: { Authorization: `Bearer ${token}` } };
  
  useEffect(() => {
    fetchStats();
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (activeTab === 'view-drives') fetchJobs();
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'applications') fetchApps();
  }, [activeTab]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/institute/users', config);
      setCompanies(res.data.filter(u => u.role === 'company'));
    } catch (err) { console.error(err); }
  };
  
  const tabTitles = {
    'overview': 'Institution Dashboard',
    'create-drive': 'Placement Drives',
    'view-drives': 'View Placement Drives',
    'manage-companies': 'Manage Companies',
    'applications': 'Student Applications',
    'eligibility': 'Eligibility Criteria',
    'notifications': 'Notifications',
    'reports': 'Reports & Analytics'
  };
  
  const handleCreateDrive = async (e) => {
    e.preventDefault();
    if (!newDrive.companyId) return alert('Please select a company');
    try {
      await axios.post('http://localhost:5000/api/institute/jobs', {
        companyId: newDrive.companyId,
        title: newDrive.title,
        description: `${newDrive.shortDesc ? newDrive.shortDesc + ' | ' : ''}Package: ${newDrive.packageStr} | Date: ${newDrive.date} | Eligibility: ${newDrive.eligibility}`,
        requiredSkills: []
      }, config);
      alert('Drive Created!');
      fetchJobs();
      setActiveTab('view-drives');
    } catch (err) {
      alert('Error creating drive: ' + (err.response?.data?.message || err.message));
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">{tabTitles[activeTab] || 'Institution Dashboard'}</h1>
          <p className="mt-2 text-sm text-gray-600 font-medium tracking-wide">PlaceSync DriveX Analytics & Reporting</p>
        </div>
        {activeTab !== 'overview' && (
          <button 
            onClick={() => setActiveTab('overview')} 
            className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors shadow-sm"
          >
            ← Back to Overview
          </button>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Top Bar Stats block matching the user's mockup */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row justify-around items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            <div className="flex items-center space-x-3 px-6 py-3 w-full sm:w-auto justify-center">
              <ClipboardList className="text-gray-400 w-5 h-5"/>
              <span className="text-gray-600 font-semibold tracking-wide">Total Students: <strong className="text-gray-900 text-lg ml-1">{stats.users}</strong></span>
            </div>
            <div className="flex items-center space-x-3 px-6 py-3 w-full sm:w-auto justify-center">
              <Users className="text-gray-400 w-5 h-5"/>
              <span className="text-gray-600 font-semibold tracking-wide">Placed: <strong className="text-gray-900 text-lg ml-1">120</strong></span>
            </div>
            <div className="flex items-center space-x-3 px-6 py-3 w-full sm:w-auto justify-center">
              <Building className="text-gray-400 w-5 h-5"/>
              <span className="text-gray-600 font-semibold tracking-wide">Ongoing Drives: <strong className="text-gray-900 text-lg ml-1">{stats.jobs}</strong></span>
            </div>
          </div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard 
              icon={<Calendar className="w-6 h-6"/>} 
              title="Placement Drives" 
              desc="Create and manage placement drives" 
              btnText="Create Drive" 
              secondaryBtnText="View Drives"
              onSecondaryClick={() => setActiveTab('view-drives')}
              theme="indigo"
              onClick={() => setActiveTab('create-drive')}
            />
            <DashboardCard 
              icon={<Activity className="w-6 h-6"/>} 
              title="Student Applications" 
              desc="Track student applications & status" 
              btnText="View Applications" 
              theme="emerald"
              onClick={() => setActiveTab('applications')}
            />
            <DashboardCard 
              icon={<Briefcase className="w-6 h-6"/>} 
              title="Companies" 
              desc="Manage and coordinate with companies" 
              btnText="Manage Companies" 
              theme="amber"
              onClick={() => setActiveTab('manage-companies')}
            />
            <DashboardCard 
              icon={<ClipboardList className="w-6 h-6"/>} 
              title="Eligibility Criteria" 
              desc="Set CGPA, branch & skills" 
              btnText="Set Criteria" 
              theme="sky"
              onClick={() => setActiveTab('eligibility')}
            />
            <DashboardCard 
              icon={<Bell className="w-6 h-6"/>} 
              title="Notifications" 
              desc="Send updates to students via SMS and email instantly." 
              btnText="Send" 
              theme="purple"
              onClick={() => setActiveTab('notifications')}
            />
            <DashboardCard 
              icon={<BarChart2 className="w-6 h-6"/>} 
              title="Reports & Analytics" 
              desc="View placement performance tracking and historical CSV exports." 
              btnText="View Reports" 
              theme="rose"
              onClick={() => setActiveTab('reports')}
            />
          </div>
        </div>
      )}

      {/* Conditional Rendering of Content beneath */}
      {activeTab !== 'overview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">

        {activeTab === 'create-drive' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">Create Placement Drive</h3>
            <form className="space-y-6 max-w-3xl" onSubmit={handleCreateDrive}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <select value={newDrive.companyId} onChange={e => setNewDrive({...newDrive, companyId: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm">
                    <option value="">Select Company</option>
                    {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Role</label>
                  <input type="text" value={newDrive.title} onChange={e => setNewDrive({...newDrive, title: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm" placeholder="e.g. Software Developer" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Package</label>
                  <input type="text" value={newDrive.packageStr} onChange={e => setNewDrive({...newDrive, packageStr: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm" placeholder="e.g. 6 LPA" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input type="date" value={newDrive.date} onChange={e => setNewDrive({...newDrive, date: e.target.value})} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                  <textarea rows="2" value={newDrive.shortDesc} onChange={e => setNewDrive({...newDrive, shortDesc: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm" placeholder="Brief details about the company or the drive..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Eligibility</label>
                  <select value={newDrive.eligibility} onChange={e => setNewDrive({...newDrive, eligibility: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm">
                    <option value="CGPA > 7">CGPA &gt; 7</option>
                    <option value="CGPA > 8">CGPA &gt; 8</option>
                    <option value="CGPA > 9">CGPA &gt; 9</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                  Create Drive
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'view-drives' && (
          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">View Placement Drives</h3>
              <div className="space-x-3">
                 <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-100">
                    Ongoing Drives ({dataJobs.filter(j => j.isActive).length})
                 </button>
                 <button className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-100">
                    Upcoming Drives ({dataJobs.filter(j => !j.isActive).length})
                 </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border-t border-gray-100">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Company</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {dataJobs.map((job, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-bold text-gray-900">{job.companyId?.name || 'Unknown'}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-600">{job.title}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-500 truncate max-w-xs" title={job.description}>{job.description}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-md border text-xs font-bold ${job.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {job.isActive ? 'Ongoing' : 'Upcoming'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {dataJobs.length === 0 && (
                     <tr><td colSpan="4" className="text-center py-8 text-gray-500 text-sm font-medium">No drives found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'manage-companies' && (
          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">Registered Companies</h3>
              <div className="space-x-3">
                 <button className="px-4 py-2 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg shadow-sm border border-rose-100 hover:bg-rose-100">Add Company</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border-t border-gray-100">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Company Name</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Email Contact</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Registered On</th>
                    <th className="px-4 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {companies.map((co, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-bold text-gray-900">{co.name}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-600">{co.email}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-500">
                        {new Date(co.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                         <button className="text-indigo-600 font-semibold px-2 hover:text-indigo-800 text-sm transition-colors">View</button>
                         <button className="text-rose-600 font-semibold px-2 hover:text-rose-800 text-sm transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {companies.length === 0 && (
                     <tr><td colSpan="4" className="text-center py-8 text-gray-500 text-sm">No companies registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">Student Applications</h3>
              <div className="space-x-3">
                 <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-100">Export CSV</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border-t border-gray-100">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Job Role</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Match Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {dataApps.map((app, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-bold text-gray-900">{app.studentId?.name || 'Unknown'}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-600">{app.jobId?.title || 'Unknown Job'}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-md border text-xs font-bold ${
                          app.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          app.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : ''}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-indigo-600">
                         {app.matchScore || 0}%
                      </td>
                    </tr>
                  ))}
                  {dataApps.length === 0 && (
                     <tr><td colSpan="4" className="text-center py-8 text-gray-500 text-sm">No applications found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="p-8 max-w-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center">Eligibility Criteria</h3>
            <form className="space-y-8" onSubmit={(e) => { 
                e.preventDefault(); 
                localStorage.setItem('institute_eligibility', JSON.stringify(eligibility));
                alert('Eligibility Updated!'); 
                setActiveTab('overview'); 
              }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 flex justify-between">
                  <span>Minimum CGPA:</span>
                  <span className="text-lg font-black text-rose-500">{eligibility.cgpa.toFixed(1)}</span>
                </label>
                <input 
                  type="range" min="0" max="10" step="0.1" 
                  value={eligibility.cgpa} 
                  onChange={(e) => setEligibility({...eligibility, cgpa: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Eligible Branches:</label>
                <div className="flex flex-wrap gap-4">
                  {['CSE', 'IT', 'ECE', 'MECH', 'CIVIL'].map(branch => {
                    const isSelected = eligibility.branches.includes(branch);
                    return (
                       <label key={branch} className="flex items-center space-x-2 cursor-pointer group">
                         <div className={`w-5 h-5 rounded border flex justify-center items-center font-bold text-xs shadow-sm transition-colors ${isSelected ? 'bg-rose-500 border-rose-600 text-white' : 'bg-white border-gray-300 text-transparent group-hover:border-rose-400'}`}>
                           ✓
                         </div>
                         <span className="font-medium text-gray-800 transition-colors">{branch}</span>
                         <input type="checkbox" className="hidden" checked={isSelected} onChange={() => {
                           const newBranches = isSelected 
                             ? eligibility.branches.filter(b => b !== branch)
                             : [...eligibility.branches, branch];
                           setEligibility({...eligibility, branches: newBranches});
                         }} />
                       </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Skills:</label>
                <div className="flex flex-wrap gap-3 mb-3">
                   {eligibility.skills.map((skill, idx) => (
                     <div key={idx} className="flex items-center px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold shadow-inner group">
                       <span>{skill}</span>
                       <button type="button" onClick={() => setEligibility({...eligibility, skills: eligibility.skills.filter((_, i) => i !== idx)})} className="ml-2 text-gray-400 hover:text-rose-500 font-bold focus:outline-none">
                         ×
                       </button>
                     </div>
                   ))}
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={newSkill} 
                    onChange={e => setNewSkill(e.target.value)} 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSkill.trim() && !eligibility.skills.includes(newSkill.trim())) {
                          setEligibility({...eligibility, skills: [...eligibility.skills, newSkill.trim()]});
                          setNewSkill('');
                        }
                      }
                    }}
                    placeholder="Add a required skill..." 
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500 outline-none" 
                  />
                  <button type="button" onClick={() => {
                      if (newSkill.trim() && !eligibility.skills.includes(newSkill.trim())) {
                        setEligibility({...eligibility, skills: [...eligibility.skills, newSkill.trim()]});
                        setNewSkill('');
                      }
                  }} className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-6 flex justify-between border-t border-gray-100">
                <button type="button" onClick={() => setActiveTab('overview')} className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-sm">
                  Previous
                </button>
                <button type="submit" className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm">
                  Update Status
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-8 max-w-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">Send Notification</h3>
            <form className="space-y-6" onSubmit={(e) => { 
                e.preventDefault(); 
                if(!notificationMsg.title || !notificationMsg.message) return alert('Fill all fields');
                const newNotif = {
                  id: Date.now().toString(),
                  title: notificationMsg.title,
                  message: notificationMsg.message,
                  target: notificationMsg.target,
                  date: new Date().toISOString(),
                  isGlobal: true
                };
                const existing = JSON.parse(localStorage.getItem('global_notifications') || '[]');
                localStorage.setItem('global_notifications', JSON.stringify([newNotif, ...existing]));
                alert('Notification Sent to ' + notificationMsg.target + '!'); 
                setNotificationMsg({ title: '', message: '', target: 'all' });
                setActiveTab('overview'); 
              }}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Title:</label>
                <input type="text" value={notificationMsg.title} onChange={e => setNotificationMsg({...notificationMsg, title: e.target.value})} placeholder="e.g. TCS Drive Announcement" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors bg-white shadow-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Message:</label>
                <textarea rows="3" value={notificationMsg.message} onChange={e => setNotificationMsg({...notificationMsg, message: e.target.value})} placeholder="e.g. Apply before 8 April" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition-colors bg-white shadow-sm"></textarea>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-3">Send To:</label>
                 <div className="space-y-3 flex flex-col">
                    <label className="flex items-center space-x-3 cursor-pointer group" onClick={() => setNotificationMsg({...notificationMsg, target: 'all'})}>
                      <div className={`w-4 h-4 rounded-full ${notificationMsg.target === 'all' ? 'border-[5px] border-rose-600' : 'border border-gray-300'} bg-white shadow-sm`}></div>
                      <span className={`font-semibold transition-colors ${notificationMsg.target === 'all' ? 'text-gray-800' : 'text-gray-500 group-hover:text-rose-600'}`}>All Students</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group" onClick={() => setNotificationMsg({...notificationMsg, target: 'specific'})}>
                      <div className={`w-4 h-4 rounded-full ${notificationMsg.target === 'specific' ? 'border-[5px] border-rose-600' : 'border border-gray-300'} bg-white shadow-sm`}></div>
                      <span className={`font-semibold transition-colors ${notificationMsg.target === 'specific' ? 'text-gray-800' : 'text-gray-500 group-hover:text-rose-600'}`}>Specific College</span>
                    </label>
                 </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button type="submit" className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm">
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">Placement Reports & Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-xl flex items-center justify-center space-x-3">
                  <ClipboardList className="w-5 h-5 text-rose-500"/>
                  <span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Total Students <strong className="text-gray-900 text-xl ml-2">{stats.users || 0}</strong></span>
               </div>
               <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-xl flex items-center justify-center space-x-3">
                  <Users className="w-5 h-5 text-rose-500"/>
                  <span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Placed <strong className="text-gray-900 text-xl ml-2">120</strong></span>
               </div>
               <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-xl flex items-center justify-center space-x-3">
                  <Building className="w-5 h-5 text-rose-500"/>
                  <span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Companies <strong className="text-gray-900 text-xl ml-2">{stats.companies || 0}</strong></span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
               {/* Pie Chart Representation */}
               <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
                 <h4 className="font-bold text-gray-800 mb-8 text-md border-b border-gray-100 pb-2">Placement Overview</h4>
                 <div className="flex flex-col sm:flex-row items-center justify-around gap-10">
                   <div className="relative w-36 h-36 rounded-full flex items-center justify-center text-white font-bold shadow-md transform hover:scale-105 transition-transform" style={{ background: 'conic-gradient(#10b981 0% 64%, #f43f5e 64% 100%)' }}>
                       <span className="absolute inset-0 flex items-center justify-center flex-col text-sm drop-shadow-md bg-black/10 rounded-full">
                         <span className="text-2xl font-black">64%</span>
                         Placed
                       </span>
                   </div>
                   <div className="flex flex-col space-y-5">
                     <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <div className="w-4 h-4 rounded bg-emerald-500 shadow-sm"></div>
                        <span className="text-sm font-bold text-gray-700">Placed <span className="text-gray-500 font-semibold ml-2">64%</span></span>
                     </div>
                     <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <div className="w-4 h-4 rounded bg-rose-500 shadow-sm"></div>
                        <span className="text-sm font-bold text-gray-700">Not Placed <span className="text-gray-500 font-semibold ml-2">36%</span></span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="mt-10">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Company-wise Placements</p>
                   <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                      <div className="bg-emerald-500 h-full hover:opacity-80 transition-opacity" style={{ width: '60%'}} title="TCS: 60%"></div>
                      <div className="bg-emerald-400 h-full hover:opacity-80 transition-opacity" style={{ width: '20%'}} title="Infosys: 20%"></div>
                      <div className="bg-emerald-300 h-full hover:opacity-80 transition-opacity" style={{ width: '20%'}} title="Wipro: 20%"></div>
                   </div>
                 </div>
               </div>

               {/* Bar Chart Representation */}
               <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between">
                 <div>
                   <h4 className="font-bold text-gray-800 mb-6 text-md border-b border-gray-100 pb-2">Top Companies</h4>
                   
                   <div className="flex flex-col space-y-4 mb-8">
                     {(stats.topCompanies || []).length > 0 ? (
                       stats.topCompanies.map((tc, idx) => (
                         <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                           <span>{tc.name}</span><span className="text-gray-600 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-200">{tc.count}</span>
                         </div>
                       ))
                     ) : (
                       <div className="text-sm text-gray-500 text-center py-4">No data available</div>
                     )}
                   </div>
                 </div>

                 <div className="flex items-end space-x-4 w-full h-32 border-b border-gray-200 pb-1 mt-auto px-2">
                    {[15, 20, 35, 25, 45, 60, 20].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500 hover:bg-emerald-400 rounded-t-sm transition-colors relative group" style={{ height: `${h}%` }}>
                      </div>
                    ))}
                 </div>
                 <div className="flex space-x-4 w-full mt-3 text-xs text-gray-500 font-bold text-center px-2">
                    <span className="flex-1 truncate">TCS</span>
                    <span className="flex-1 truncate">Infy</span>
                    <span className="flex-1 truncate">Wipro</span>
                    <span className="flex-1 truncate">Cap</span>
                    <span className="flex-1 truncate">HCL</span>
                    <span className="flex-1 truncate">TechM</span>
                    <span className="flex-1 truncate">L&T</span>
                 </div>
               </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm">
                Placement Reports
              </button>
            </div>
          </div>
        )}

        </div>
      )}
    </div>
  );
};
