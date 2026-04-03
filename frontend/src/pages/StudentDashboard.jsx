import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, CheckCircle, Clock, Search, MapPin } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [filters, setFilters] = useState({ skills: '', location: '', experience: '' });
  const [activeFilters, setActiveFilters] = useState({ skills: '', location: '', experience: '' });
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showAppliedModal, setShowAppliedModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showWFHModal, setShowWFHModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'AI', text: "Hello! I am the DriveX AI Assistant. I can help you with company information, recent tech stack news, and required skills. What company are you researching today?" }
  ]);
  const [globalNotifs, setGlobalNotifs] = useState([]);
  
  const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : '';

  const mockAppliedCompanies = [
    { id: 1, name: "Google", role: "Software Engineer", skills: ["React", "Node.js", "System Design"], status: "In Review", appliedDate: "2026-03-20" },
    { id: 2, name: "Microsoft", role: "Frontend Developer", skills: ["TypeScript", "React", "Redux"], status: "Shortlisted", appliedDate: "2026-03-15" },
    { id: 3, name: "Amazon", role: "Full Stack Engineer", skills: ["AWS", "Java", "React"], status: "Applied", appliedDate: "2026-03-25" },
    { id: 4, name: "Netflix", role: "UI Engineer", skills: ["React", "CSS Animation", "GraphQL"], status: "Rejected", appliedDate: "2026-02-10" }
  ];

  const mockWFHJobs = [
    { id: 1, title: "Remote React Developer", company: "TechNova", salary: "$80k - $120k", type: "Full-Time (Remote)" },
    { id: 2, title: "Backend Engineer", company: "CloudWorks Solutions", salary: "$90k - $130k", type: "Contract (Remote)" },
    { id: 3, title: "UI/UX Designer", company: "Designify", salary: "$70k - $100k", type: "Full-Time (Remote)" },
    { id: 4, title: "Data Analyst", company: "DataMetrics", salary: "$60k - $90k", type: "Part-Time (Remote)" }
  ];

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
    const storedNotifs = JSON.parse(localStorage.getItem('global_notifications') || '[]');
    setGlobalNotifs(storedNotifs);
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

  const handleSearch = () => {
    setActiveFilters(filters);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'You', text: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        sender: 'AI', 
        text: `Based on analyzing recent tech news, companies matching your inquiry are actively searching for talent with strong cloud architecture skills (AWS/Azure) and robust component-driven UI experience (React, Vue). It's a great time to ensure your portfolio reflects those specific buzzwords before your next interview!` 
      }]);
    }, 1200);
  };

  const filteredJobs = jobs.filter(job => {
    let match = true;
    if (activeFilters.skills) {
      match = match && job.requiredSkills?.some(skill => skill.toLowerCase().includes(activeFilters.skills.toLowerCase()));
    }
    if (activeFilters.location) {
      match = match && (job.description?.toLowerCase().includes(activeFilters.location.toLowerCase()) || job.title?.toLowerCase().includes(activeFilters.location.toLowerCase()));
    }
    if (activeFilters.experience) {
      match = match && (job.description?.toLowerCase().includes(activeFilters.experience.toLowerCase()) || job.title?.toLowerCase().includes(activeFilters.experience.toLowerCase()));
    }
    return match;
  });

  const shortlistedApplications = myApplications.filter(app => app.status === 'shortlisted');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center justify-between mb-8">
        <div className="flex justify-between items-center w-full mb-6 relative">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          
          {/* Notification Button */}
          <div className="relative group">
            <button className="relative p-2.5 bg-white rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm border border-gray-200 focus:outline-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              {(shortlistedApplications.length + globalNotifs.length) > 0 && (
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>
            
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50 transform origin-top-right scale-95 group-hover:scale-100">
              <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-white rounded-t-2xl">
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{shortlistedApplications.length + globalNotifs.length} New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {(shortlistedApplications.length === 0 && globalNotifs.length === 0) ? (
                  <p className="text-sm text-gray-500 p-6 text-center">No new notifications</p>
                ) : (
                  <>
                    {globalNotifs.map(notif => (
                      <div key={notif.id} className="px-4 py-4 border-b border-gray-50 hover:bg-rose-50/50 transition-colors cursor-pointer flex items-start gap-4">
                        <div className="bg-rose-100 text-rose-600 p-2 rounded-full flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 leading-snug font-bold">
                            {notif.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1.5">{new Date(notif.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                    {shortlistedApplications.map((app) => (
                      <div key={app._id} className="px-4 py-4 border-b border-gray-50 hover:bg-indigo-50/50 transition-colors cursor-pointer flex items-start gap-4">
                        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 leading-snug">
                            Congratulations! You have been <span className="font-bold text-emerald-600">shortlisted</span> for the <span className="font-semibold">{app.jobId?.title || 'Unknown Role'}</span> role at <span className="font-semibold">{app.jobId?.companyId?.name || 'Unknown Company'}</span>.
                          </p>
                          <p className="text-xs text-gray-500 mt-1.5">{new Date(app.updatedAt || app.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Multi-Filter Bar */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center bg-white rounded-3xl md:rounded-full shadow-sm border border-gray-200 divide-y md:divide-y-0 md:divide-x divide-gray-200 transition-shadow hover:shadow-md focus-within:shadow-md focus-within:border-indigo-300 md:pr-2">
          <div className="w-full md:flex-1 flex items-center px-4 py-3 hover:bg-gray-50 rounded-t-3xl md:rounded-l-full md:rounded-tr-none transition-colors">
            <Search className="w-5 h-5 text-gray-400 mr-3 hidden md:block" />
            <div className="flex flex-col w-full">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1 md:hidden">Skills</span>
              <input
                type="text"
                placeholder="Skills (e.g. React)..."
                value={filters.skills}
                onChange={(e) => setFilters({...filters, skills: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 focus:ring-0 sm:text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="w-full md:flex-1 flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
            <MapPin className="w-5 h-5 text-gray-400 mr-3 hidden md:block" />
            <div className="flex flex-col w-full">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1 md:hidden">Location</span>
              <input
                type="text"
                placeholder="Location..."
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 focus:ring-0 sm:text-sm font-medium"
              />
            </div>
          </div>

          <div className="w-full md:flex-1 flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
            <Briefcase className="w-5 h-5 text-gray-400 mr-3 hidden md:block" />
            <div className="flex flex-col w-full">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1 md:hidden">Experience</span>
              <input
                type="text"
                placeholder="Experience..."
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 focus:ring-0 sm:text-sm font-medium"
              />
            </div>
          </div>

          <div className="w-full md:w-auto p-2 md:p-1 md:pl-2">
            <button
               onClick={handleSearch}
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-2xl md:rounded-full flex items-center justify-center transition-colors shadow-sm font-semibold text-sm"
            >
               <Search className="w-4 h-4 mr-2" />
               <span>Search</span>
            </button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="w-full max-w-4xl mt-6 flex flex-wrap justify-center gap-3 relative z-10">
          
          <div className="relative group">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none transition-colors shadow-sm flex items-center">
              Profile
              <svg className="w-4 h-4 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 top-full">
              {['Resume', 'Applied Companies', 'Track Applicants', 'Interview', 'Schedule', 'Chat'].map((subItem) => (
                <button 
                  key={subItem} 
                  onClick={() => {
                    if (subItem === 'Resume') setShowResumeModal(true);
                    else if (subItem === 'Applied Companies') setShowAppliedModal(true);
                    else if (subItem === 'Track Applicants') setShowTrackModal(true);
                    else if (subItem === 'Interview') setShowInterviewModal(true);
                    else if (subItem === 'Schedule') setShowScheduleModal(true);
                    else if (subItem === 'Chat') setShowChatModal(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                >
                  {subItem}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none transition-colors shadow-sm flex items-center">
              Jobs
              <svg className="w-4 h-4 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 top-full">
              {['Work from Home', 'Walk-in Jobs', 'Night Shift Jobs', 'Jobs for Freshers', 'Jobs by Role', 'Jobs by Skills', 'Internships'].map((subItem) => (
                <button 
                  key={subItem} 
                  onClick={() => {
                    if (subItem === 'Work from Home') setShowWFHModal(true);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                >
                  {subItem}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none transition-colors shadow-sm flex items-center">
              Training Support
              <svg className="w-4 h-4 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 top-full z-20">
              {['Mock Interview', 'Technical Class', 'Language Training', 'Previous Years Q&A'].map((subItem) => (
                <button 
                  key={subItem} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                >
                  {subItem}
                </button>
              ))}
            </div>
          </div>

          {['Career', 'Multiple College Support'].map((item) => (
            <button 
              key={item} 
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none transition-colors shadow-sm"
            >
              {item}
            </button>
          ))}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
            Available Jobs ({filteredJobs.length})
          </h2>
          {filteredJobs.length === 0 && <p className="text-gray-500 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">No jobs match your search.</p>}
          {filteredJobs.map(job => (
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

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">My Resume</h2>
              <button onClick={() => setShowResumeModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
               <div className="space-y-6 text-gray-700">
                  <div className="border-b border-gray-100 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">Alex Johnson</h1>
                    <p className="text-sm text-gray-500 mt-1">alex.johnson@example.com | (555) 123-4567 | New York, NY</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-100 pb-2 mb-3">Professional Summary</h3>
                    <p className="text-sm leading-relaxed text-gray-600">Passionate and detail-oriented computer science student with a strong foundation in MERN stack development. Eager to leverage academic experience and personal projects into a professional software engineering role.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-100 pb-2 mb-3">Education</h3>
                    <div className="mb-2">
                      <div className="flex justify-between font-bold text-gray-800 text-sm">
                        <span>B.S. in Computer Science</span>
                        <span>May 2026</span>
                      </div>
                      <p className="text-sm text-gray-600">State University, New York</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-100 pb-2 mb-3">Experience</h3>
                    <div className="mb-2">
                      <div className="flex justify-between font-bold text-gray-800 text-sm">
                        <span>Frontend Developer Intern</span>
                        <span>Summer 2025</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Tech Solutions Inc, San Francisco, CA</p>
                      <ul className="list-disc list-outside ml-4 text-sm space-y-1 text-gray-600">
                        <li>Developed responsive UI components using React and Tailwind CSS.</li>
                        <li>Collaborated with design team to improve user experience.</li>
                        <li>Reduced page load times by 15% through optimized asset loading.</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-100 pb-2 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Git'].map(s => <span key={s} className="bg-gray-100 px-3 py-1 rounded-md text-xs font-semibold text-gray-700">{s}</span>)}
                    </div>
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
               <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition" onClick={() => setShowResumeModal(false)}>
                 Close
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Applied Companies Modal */}
      {showAppliedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Applied Companies</h2>
              <button onClick={() => setShowAppliedModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-gray-50">
               <div className="space-y-4">
                  {mockAppliedCompanies.map(company => (
                    <div key={company.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                       <div>
                         <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                         <p className="text-indigo-600 font-medium mb-2">{company.role}</p>
                         <p className="text-xs text-gray-500 mb-3">Applied on: {company.appliedDate}</p>
                         <div className="flex flex-wrap gap-2">
                           {company.skills.map(skill => (
                             <span key={skill} className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold">
                               {skill}
                             </span>
                           ))}
                         </div>
                       </div>
                       <div className="flex items-center">
                         <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                           ${company.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' : 
                             company.status === 'In Review' ? 'bg-amber-100 text-amber-800' : 
                             company.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 
                             'bg-gray-100 text-gray-800'}`}>
                           {company.status}
                         </span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
               <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition" onClick={() => setShowAppliedModal(false)}>
                 Close
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Applicants Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Track Applications</h2>
              <button onClick={() => setShowTrackModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-gray-50">
               {myApplications.length === 0 ? (
                 <div className="text-center p-10 bg-white rounded-xl border border-gray-200">
                   <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {myApplications.map(app => (
                      <div key={app._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                         <div>
                           <h3 className="text-xl font-bold text-gray-900">{app.jobId?.title || 'Unknown Role'}</h3>
                           <p className="text-indigo-600 font-medium mb-1">{app.jobId?.companyId?.name || 'Unknown Company'}</p>
                           <p className="text-xs text-gray-500">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div className="flex items-center">
                           <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                             ${app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-800' : 
                               app.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 
                               'bg-indigo-100 text-indigo-800'}`}>
                             {app.status}
                           </span>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
               <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition" onClick={() => setShowTrackModal(false)}>
                 Close
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Pending Interviews</h2>
              <button onClick={() => setShowInterviewModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-gray-50">
               {myApplications.filter(app => app.status === 'shortlisted').length === 0 ? (
                 <div className="text-center p-10 bg-white rounded-xl border border-gray-200">
                   <p className="text-gray-500">You don't have any shortlisted interviews yet.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {myApplications.filter(app => app.status === 'shortlisted').map(app => (
                      <div key={app._id} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {(app.jobId?.companyId?.name || 'C').charAt(0)}
                             </div>
                             <h3 className="text-xl font-bold text-gray-900">{app.jobId?.companyId?.name || 'Unknown Company'}</h3>
                           </div>
                           <p className="text-indigo-600 font-medium pl-10 text-sm whitespace-nowrap">{app.jobId?.title || 'Unknown Role'}</p>
                         </div>
                         <div className="flex items-center">
                           <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors">
                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                             Connect
                           </button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
               <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition" onClick={() => setShowInterviewModal(false)}>
                 Close
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">My Schedule</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-gray-50">
               {myApplications.filter(app => app.status === 'shortlisted').length === 0 ? (
                 <div className="text-center p-10 bg-white rounded-xl border border-gray-200">
                   <p className="text-gray-500">No events scheduled. Wait to be shortlisted!</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {myApplications.filter(app => app.status === 'shortlisted').map((app, index) => {
                      const scheduleDate = new Date();
                      scheduleDate.setDate(scheduleDate.getDate() + (index + 1) * 3);
                      
                      return (
                      <div key={app._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                         <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                           <h3 className="text-lg font-bold text-gray-900">{app.jobId?.companyId?.name || 'Unknown Company'}</h3>
                           <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Confirmed</span>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="flex items-center text-gray-700">
                              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Date & Time</p>
                                <p className="font-medium text-sm">{scheduleDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})} at 10:00 AM</p>
                              </div>
                           </div>
                           <div className="flex items-center text-gray-700">
                              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Location/Link</p>
                                <p className="font-medium text-sm text-indigo-600 underline cursor-pointer hover:text-indigo-800">Virtual (Zoom Link)</p>
                              </div>
                           </div>
                         </div>
                      </div>
                    )})}
                 </div>
               )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
               <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition" onClick={() => setShowScheduleModal(false)}>
                 Close
               </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden h-[600px] max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-indigo-600 text-white">
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  <span className="bg-white text-indigo-600 p-1.5 rounded-lg mr-3 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </span>
                  DriveX AI Assistant
                </h2>
                <p className="text-indigo-100 text-xs mt-1 tracking-wide uppercase font-semibold">Company Insights & Skill Research</p>
              </div>
              <button onClick={() => setShowChatModal(false)} className="text-indigo-200 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
               {chatMessages.map((msg, idx) => (
                 <div key={idx} className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.sender === 'AI' ? 'bg-white border border-gray-100 text-gray-800 self-start rounded-tl-none' : 'bg-indigo-600 text-white self-end rounded-tr-none'}`}>
                   <p className={`text-xs font-bold mb-1 uppercase tracking-wider ${msg.sender === 'AI' ? 'text-indigo-500' : 'text-indigo-200'}`}>{msg.sender}</p>
                   <p className="text-sm leading-relaxed">{msg.text}</p>
                 </div>
               ))}
               {/* Invisible div to scroll to bottom could go here, but this works fine for mock */}
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-white">
               <div className="flex items-center gap-3">
                 <input 
                   type="text" 
                   value={chatInput} 
                   onChange={(e) => setChatInput(e.target.value)} 
                   onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Ask about a company, required skills, or recent news..."
                   className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm transition-shadow"
                 />
                 <button onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors shadow-sm flex items-center justify-center">
                   <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* WFH Jobs Modal */}
      {showWFHModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Work from Home Jobs</h2>
              <button onClick={() => setShowWFHModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-gray-50 space-y-4">
              {mockWFHJobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
                   <div>
                     <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                     <p className="text-indigo-600 font-medium mb-1">{job.company}</p>
                     <p className="text-sm text-gray-500">Salary Range: {job.salary}</p>
                   </div>
                   <div className="flex flex-col items-end gap-3">
                     <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                       {job.type}
                     </span>
                     <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                       Apply Now
                     </button>
                   </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
               <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition" onClick={() => setShowWFHModal(false)}>
                 Close
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Chat/Help */}
      <button 
        onClick={() => setShowChatModal(true)}
        className="fixed bottom-8 right-8 z-40 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 hover:shadow-[0_20px_25px_-5px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
      >
        <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
          Ask AI Assistant
        </span>
      </button>

    </div>
  );
};
