import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { auth } from '../../auth';
import Profile from './Profile.jsx';
import SavedJobs from './SavedJobs.jsx';
import AppliedJobs from './AppliedJobs.jsx';
import Sidebar from './Layout/Sidebar.jsx';
import JobAlertsSection from './JobAlertsSection.jsx';
import InterviewPrep from './InterviewPrep/InterviewPrep.jsx';
import './Dashboard.css';

// Import LoadingSkeleton - CREATE THIS FILE FIRST
import LoadingSkeleton from '../LoadingSkeleton';

const Dashboard = () => {
  const [user, setUser] = useState(null); // Start as null for loading state
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // NEW: Loading state

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      
      // Add a small delay for better UX (skeleton loading effect)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check and fix storage first
      const currentUser = auth.checkAndFixStorage ? auth.checkAndFixStorage() : auth.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setStats(auth.getUserStats());
        setRecentActivity(auth.getRecentActivity());
      }
      
      setLoading(false);
    };

    initializeDashboard();
    
    // Listen for storage changes (for logout/login from other tabs)
    const handleStorageChange = () => {
      const currentUser = auth.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setStats(auth.getUserStats());
        setRecentActivity(auth.getRecentActivity());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Show loading skeleton
  if (loading) {
    return (
      <div className="dashboard-container">
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          disabled
        >
          ☰ Open Menu
        </button>
        <div className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <LoadingSkeleton type="dashboard" />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
      >
        {sidebarOpen ? '✕ Close Menu' : '☰ Open Menu'}
      </button>

      {sidebarOpen && (
        <Sidebar 
          user={user} 
          onClose={closeSidebar}
        />
      )}
      
      <div className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Routes>
          <Route path="/" element={<DashboardOverview user={user} stats={stats} recentActivity={recentActivity} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/applied" element={<AppliedJobs />} />
          <Route path="/resume" element={<ResumeSection user={user} setUser={setUser} />} />
          <Route path="/alerts" element={<JobAlertsSection />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/settings" element={<SettingsSection user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

// Dashboard Overview Component with loading states
const DashboardOverview = ({ user, stats, recentActivity }) => {
  const [localLoading, setLocalLoading] = useState(!user || !stats);
  
  useEffect(() => {
    if (user && stats) {
      setLocalLoading(false);
    }
  }, [user, stats]);
  
  if (localLoading) {
    return <LoadingSkeleton type="dashboard" />;
  }
  
  return (
    <>
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋</h1>
        <span className="dashboard-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-number">{stats?.savedJobs || 0}</div>
          <h3>Saved Jobs</h3>
          <p>Jobs you've bookmarked</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-number">{stats?.appliedJobs || 0}</div>
          <h3>Applications</h3>
          <p>Jobs you've applied to</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-number">{stats?.profileCompletion || 0}%</div>
          <h3>Profile Complete</h3>
          <p>Your profile strength</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-number">{stats?.totalSkills || 0}</div>
          <h3>Skills</h3>
          <p>Skills in your profile</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <a href="/dashboard/applied" className="view-all">View All</a>
        </div>
        
        <div className="activity-list">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <h4>{activity.message}</h4>
                  <p>{activity.type === 'applied' ? 'Application submitted' : 'Profile activity'}</p>
                </div>
                <div className="activity-time">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="no-activity">No recent activity. Start by saving or applying to jobs!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <button className="action-btn" onClick={() => window.location.href = '/dashboard/resume'}>
            <span>📄</span>
            <span>Update Resume</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/jobs'}>
            <span>🎯</span>
            <span>Search Jobs</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/dashboard/alerts'}>
            <span>🔔</span>
            <span>Set Alerts</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/dashboard/applied'}>
            <span>📊</span>
            <span>View Stats</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Resume Section Component with loading state
const ResumeSection = ({ user, setUser }) => {
  const [uploading, setUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      setResumeFile(file);
    }
  };

  const handleUpload = () => {
    if (!resumeFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    
    setTimeout(() => {
      const newResume = {
        fileName: resumeFile.name,
        fileSize: (resumeFile.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadDate: new Date().toISOString(),
        fileType: resumeFile.type,
        lastUpdated: new Date().toISOString()
      };
      
      const updatedUser = { ...user, resume: newResume };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      if (auth.updateProfile) {
        auth.updateProfile({ resume: newResume });
      }
      
      setUser(updatedUser);
      setResumeFile(null);
      setUploading(false);
      alert('Resume uploaded successfully!');
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your resume?')) {
      const updatedUser = { ...user };
      delete updatedUser.resume;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      if (auth.deleteResume) {
        auth.deleteResume();
      }
      
      setUser(updatedUser);
      alert('Resume deleted successfully!');
    }
  };

  const handleDownload = () => {
    alert('Downloading resume... (This is a demo)');
  };

  const handleUpdate = () => {
    document.getElementById('resume-update-input').click();
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    return '📋';
  };

  if (loading) {
    return (
      <div className="dashboard-section">
        <LoadingSkeleton type="card" count={1} />
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>My Resume</h2>
      </div>
      
      {user?.resume ? (
        <div className="resume-card">
          <div className="resume-info">
            <div className="resume-header">
              <div className="resume-icon">{getFileIcon(user.resume.fileType)}</div>
              <div>
                <h3>{user.resume.fileName}</h3>
                <div className="resume-meta">
                  <span className="meta-item">📦 {user.resume.fileSize}</span>
                  <span className="meta-item">📅 Uploaded: {new Date(user.resume.uploadDate).toLocaleDateString()}</span>
                  {user.resume.lastUpdated && (
                    <span className="meta-item">🔄 Updated: {new Date(user.resume.lastUpdated).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="resume-actions">
              <button className="btn-primary" onClick={handleDownload}>
                <span className="action-icon">⬇️</span> Download Resume
              </button>
              <button className="btn-secondary" onClick={handleUpdate}>
                <span className="action-icon">🔄</span> Update Resume
              </button>
              <input 
                id="resume-update-input"
                type="file" 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button className="btn-danger" onClick={handleDelete}>
                <span className="action-icon">🗑️</span> Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="upload-resume">
          <div className="upload-icon">📄</div>
          <h3>No resume uploaded yet</h3>
          <p>Upload your resume to increase your chances by 50%</p>
          <p className="upload-hint">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
          
          <div className="upload-area">
            <input 
              type="file" 
              id="resume-upload"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="resume-upload" className="upload-label">
              <span className="upload-icon-large">📤</span>
              <span className="upload-text">Click to browse or drag & drop</span>
              <span className="upload-subtext">
                {resumeFile ? `Selected: ${resumeFile.name}` : 'PDF or Word document'}
              </span>
            </label>
          </div>
          
          <div className="upload-actions">
            <button 
              className="btn-primary" 
              onClick={handleUpload}
              disabled={!resumeFile || uploading}
            >
              {uploading ? (
                <>
                  <span className="loading-spinner"></span> Uploading...
                </>
              ) : (
                'Upload Resume'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Settings Section Component with loading state
const SettingsSection = ({ user }) => {
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-section">
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Account Settings</h2>
      </div>
      
      <div className="settings-grid">
        <div className="setting-card">
          <h3>🔒 Security</h3>
          <p>Change password, enable 2FA</p>
          <button className="btn-secondary">Manage</button>
        </div>
        
        <div className="setting-card">
          <h3>🔔 Notifications</h3>
          <p>Email, push notifications</p>
          <button className="btn-secondary">Configure</button>
        </div>
        
        <div className="setting-card">
          <h3>🌍 Preferences</h3>
          <p>Language, theme, privacy</p>
          <button className="btn-secondary">Edit</button>
        </div>
        
        <div className="setting-card">
          <h3>🗑️ Account</h3>
          <p>Delete account, export data</p>
          <button className="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;