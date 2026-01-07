import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../../auth';
import '../Dashboard.css';

const Sidebar = ({ user, onClose }) => {
  const navigate = useNavigate();
  const profileCompletion = user?.profileCompletion || 65;

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/dashboard/profile', icon: '👤', label: 'Profile' },
    { path: '/dashboard/saved', icon: '💼', label: 'Saved Jobs' },
    { path: '/dashboard/applied', icon: '📝', label: 'Applications' },
    { path: '/dashboard/resume', icon: '📄', label: 'My Resume' }, // ADDED
    { path: '/dashboard/interview-prep', icon: '🎯', label: 'Interview Prep' }, // NEW
    { path: '/dashboard/alerts', icon: '🔔', label: 'Job Alerts' },
    { path: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
  ];

  const stats = [
    { value: user?.savedJobs?.length || 0, label: 'Saved' },
    { value: user?.appliedJobs?.length || 0, label: 'Applied' },
    { value: user?.totalSkills || 0, label: 'Skills' },
  ];

  return (
    <div className="dashboard-sidebar">
      {/* Close button - only shown when onClose function is provided */}
      {onClose && (
        <button className="sidebar-close-btn" onClick={onClose}>
          ✕
        </button>
      )}

      {/* User Profile Section */}
      <div className="sidebar-header">
        <div className="user-avatar">
          <div className="avatar-initials">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="online-status"></div>
        </div>
        <h3 className="user-name">{user?.name || 'User'}</h3>
        <p className="user-title">{user?.title || 'Job Seeker'}</p>
        <p className="user-location">{user?.location || 'Add location'}</p>
        
        {/* Profile Strength */}
        <div className="profile-progress-section">
          <div className="progress-header">
            <span>Profile Strength</span>
            <span>{profileCompletion}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-fill" 
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <p className="progress-hint">
            {profileCompletion < 50 
              ? 'Complete your profile to get better job matches' 
              : profileCompletion < 80 
              ? 'Great progress! Keep going' 
              : 'Excellent profile!'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="sidebar-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-navigation">
        <div className="nav-section">
          <div className="nav-section-title">Main Menu</div>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose} // Close sidebar when a menu item is clicked
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Account</div>
          <button 
            onClick={() => {
              handleLogout();
              if (onClose) onClose();
            }} 
            className="nav-link logout-link"
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </nav>

      {/* Upgrade Banner */}
      <div className="upgrade-banner">
        <div className="upgrade-icon">⭐</div>
        <div className="upgrade-content">
          <h5>Upgrade to Pro</h5>
          <p>Get priority support and advanced features</p>
        </div>
        <button className="upgrade-btn">Upgrade</button>
      </div>
    </div>
  );
};

export default Sidebar;