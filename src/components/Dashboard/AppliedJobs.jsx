import React, { useState, useEffect } from 'react';
import { auth } from '../../auth';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filter, setFilter] = useState('all'); // all, applied, viewed, shortlisted, rejected
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      setAppliedJobs(user.appliedJobs || []);
    }
    setLoading(false);
  }, []);

  const filteredJobs = appliedJobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const statusColors = {
    Applied: '#3b82f6',
    Viewed: '#8b5cf6',
    Shortlisted: '#10b981',
    Rejected: '#ef4444',
    'Interview Scheduled': '#f59e0b',
    'Offer Received': '#10b981'
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Applied': return '📝';
      case 'Viewed': return '👁️';
      case 'Shortlisted': return '✅';
      case 'Rejected': return '❌';
      case 'Interview Scheduled': return '📅';
      case 'Offer Received': return '🎉';
      default: return '📋';
    }
  };

  const handleUpdateStatus = (jobId, newStatus) => {
    if (auth.updateApplicationStatus(jobId, newStatus)) {
      setAppliedJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
    }
  };

  const handleWithdrawApplication = (jobId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      // In a real app, this would call an API
      setAppliedJobs(prev => prev.filter(job => job.id !== jobId));
      alert('Application withdrawn successfully!');
    }
  };

  const stats = {
    total: appliedJobs.length,
    applied: appliedJobs.filter(j => j.status === 'Applied').length,
    viewed: appliedJobs.filter(j => j.status === 'Viewed').length,
    shortlisted: appliedJobs.filter(j => j.status === 'Shortlisted').length,
    rejected: appliedJobs.filter(j => j.status === 'Rejected').length,
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="applied-jobs-container">
      <div className="page-header">
        <h1>Applied Jobs ({appliedJobs.length})</h1>
        <div className="header-actions">
          <a href="/jobs" className="btn-primary">Find More Jobs</a>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="application-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.shortlisted}</div>
          <div className="stat-label">Shortlisted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.viewed}</div>
          <div className="stat-label">Viewed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-label">Not Selected</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({stats.total})
        </button>
        <button 
          className={`filter-tab ${filter === 'Applied' ? 'active' : ''}`}
          onClick={() => setFilter('Applied')}
        >
          Applied ({stats.applied})
        </button>
        <button 
          className={`filter-tab ${filter === 'Viewed' ? 'active' : ''}`}
          onClick={() => setFilter('Viewed')}
        >
          Viewed ({stats.viewed})
        </button>
        <button 
          className={`filter-tab ${filter === 'Shortlisted' ? 'active' : ''}`}
          onClick={() => setFilter('Shortlisted')}
        >
          Shortlisted ({stats.shortlisted})
        </button>
        <button 
          className={`filter-tab ${filter === 'Rejected' ? 'active' : ''}`}
          onClick={() => setFilter('Rejected')}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      {/* Applications List */}
      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No applications found</h2>
          <p>
            {filter === 'all' 
              ? "You haven't applied to any jobs yet. Start applying to track your progress here!"
              : `No applications with status "${filter}"`}
          </p>
          {filter === 'all' && (
            <a href="/jobs" className="btn-primary">Browse Jobs</a>
          )}
        </div>
      ) : (
        <div className="applications-list">
          {filteredJobs.map((application) => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <div className="application-info">
                  <h3>{application.jobTitle}</h3>
                  <p className="company-name">{application.company}</p>
                  <div className="application-meta">
                    <span className="meta-item">
                      📅 Applied on {new Date(application.appliedDate).toLocaleDateString()}
                    </span>
                    <span className="meta-item">
                      ⏰ {new Date(application.appliedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="application-status">
                  <div 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${statusColors[application.status]}20`,
                      color: statusColors[application.status],
                      borderColor: statusColors[application.status]
                    }}
                  >
                    <span className="status-icon">
                      {getStatusIcon(application.status)}
                    </span>
                    {application.status}
                  </div>
                </div>
              </div>

              <div className="application-details">
                {application.jobDescription && (
                  <p className="job-description">{application.jobDescription}</p>
                )}
                
                <div className="application-actions">
                  <div className="status-actions">
                    <span className="action-label">Update Status:</span>
                    <select 
                      value={application.status}
                      onChange={(e) => handleUpdateStatus(application.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Viewed">Viewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Received">Offer Received</option>
                    </select>
                  </div>
                  
                  <div className="action-buttons">
                    <button className="btn-secondary">
                      View Job
                    </button>
                    <button className="btn-secondary">
                      Contact Recruiter
                    </button>
                    <button 
                      onClick={() => handleWithdrawApplication(application.id)}
                      className="btn-danger"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline (for certain statuses) */}
              {(application.status === 'Shortlisted' || application.status === 'Interview Scheduled') && (
                <div className="application-timeline">
                  <h4>Next Steps:</h4>
                  <ul className="timeline-steps">
                    <li className="step completed">
                      <span className="step-icon">✓</span>
                      <span className="step-text">Application Submitted</span>
                    </li>
                    <li className="step completed">
                      <span className="step-icon">✓</span>
                      <span className="step-text">Profile Reviewed</span>
                    </li>
                    <li className={`step ${application.status === 'Shortlisted' ? 'current' : 'completed'}`}>
                      <span className="step-icon">
                        {application.status === 'Shortlisted' ? '●' : '✓'}
                      </span>
                      <span className="step-text">Shortlisted</span>
                    </li>
                    {application.status === 'Interview Scheduled' && (
                      <li className="step current">
                        <span className="step-icon">●</span>
                        <span className="step-text">Interview Scheduled</span>
                      </li>
                    )}
                    <li className="step">
                      <span className="step-icon">○</span>
                      <span className="step-text">Final Decision</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="application-tips">
        <h3>📈 Application Success Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Customize Your Resume</h4>
            <p>Tailor your resume for each job application to increase chances by 40%.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📅</div>
            <h4>Follow Up</h4>
            <p>Send a follow-up email 5-7 days after applying to show your interest.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <h4>Track Everything</h4>
            <p>Keep notes on each application to prepare better for interviews.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📊</div>
            <h4>Analyze Rejections</h4>
            <p>Learn from rejections to improve your future applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;