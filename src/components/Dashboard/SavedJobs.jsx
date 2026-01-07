import React, { useState, useEffect } from 'react';
import { auth } from '../../auth';

// Sample jobs data (should be imported from your main jobs data)
const sampleJobs = [
  { 
    id: 1, 
    title: 'Frontend Developer', 
    company: 'Tech Corp', 
    location: 'Bangalore',
    salary: '$60k - $80k',
    type: 'Full-time',
    posted: '2 days ago',
    description: 'We are looking for a Frontend Developer with React experience...'
  },
  { 
    id: 2, 
    title: 'Backend Engineer', 
    company: 'Innovate Ltd', 
    location: 'Hyderabad',
    salary: '$70k - $90k',
    type: 'Full-time',
    posted: '5 days ago',
    description: 'Join our backend team to build scalable APIs...'
  },
  { 
    id: 3, 
    title: 'Full Stack Developer', 
    company: 'Web Solutions', 
    location: 'Tumkur',
    salary: '$50k - $70k',
    type: 'Contract',
    posted: '1 week ago',
    description: 'Full stack developer needed for a 6-month project...'
  },
  { 
    id: 4, 
    title: 'UI/UX Designer', 
    company: 'Design Studio', 
    location: 'Bangalore',
    salary: '$55k - $75k',
    type: 'Full-time',
    posted: '3 days ago',
    description: 'Creative designer needed for our product team...'
  },
];

const SavedJobs = () => {
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      const savedIds = user.savedJobs || [];
      setSavedJobIds(savedIds);
      
      // Filter sample jobs to get saved ones
      const saved = sampleJobs.filter(job => savedIds.includes(job.id));
      setSavedJobs(saved);
    }
    setLoading(false);
  }, []);

  const handleUnsaveJob = (jobId) => {
    if (auth.saveJob(jobId)) { // saveJob toggles, so it will unsave
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    }
  };

  const handleQuickApply = (job) => {
    alert(`Quick application submitted to ${job.company} for ${job.title}!`);
    // In real app, this would call auth.addApplication()
  };

  const handleRemoveAll = () => {
    savedJobIds.forEach(id => auth.saveJob(id));
    setSavedJobIds([]);
    setSavedJobs([]);
  };

  if (loading) {
    return <div className="loading">Loading saved jobs...</div>;
  }

  return (
    <div className="saved-jobs-container">
      <div className="page-header">
        <h1>Saved Jobs ({savedJobs.length})</h1>
        {savedJobs.length > 0 && (
          <button onClick={handleRemoveAll} className="btn-danger">
            Remove All
          </button>
        )}
      </div>

      {savedJobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💼</div>
          <h2>No saved jobs yet</h2>
          <p>When you find jobs you like, click the save button to bookmark them here.</p>
          <a href="/jobs" className="btn-primary">Browse Jobs</a>
        </div>
      ) : (
        <>
          <div className="saved-jobs-stats">
            <div className="stat-item">
              <span className="stat-number">{savedJobs.length}</span>
              <span className="stat-label">Total Saved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {savedJobs.filter(job => job.type === 'Full-time').length}
              </span>
              <span className="stat-label">Full-time</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {savedJobs.filter(job => job.location === 'Bangalore').length}
              </span>
              <span className="stat-label">In Bangalore</span>
            </div>
          </div>

          <div className="saved-jobs-grid">
            {savedJobs.map(job => (
              <div key={job.id} className="saved-job-card">
                <div className="job-card-header">
                  <div className="job-badges">
                    <span className="badge">{job.type}</span>
                    <span className="badge">📍 {job.location}</span>
                  </div>
                  <button 
                    onClick={() => handleUnsaveJob(job.id)}
                    className="unsave-btn"
                    title="Remove from saved"
                  >
                    ❤️
                  </button>
                </div>
                
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
                
                <div className="job-salary">
                  💰 {job.salary}
                </div>
                
                <p className="job-description">
                  {job.description}
                </p>
                
                <div className="job-posted">
                  📅 Posted {job.posted}
                </div>
                
                <div className="job-actions">
                  <a href={`/jobs/${job.id}`} className="btn-secondary">
                    View Details
                  </a>
                  <button 
                    onClick={() => handleQuickApply(job)}
                    className="btn-primary"
                  >
                    Quick Apply
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="saved-jobs-footer">
            <div className="tips">
              <h3>💡 Tips for your saved jobs:</h3>
              <ul>
                <li>Apply within 48 hours for better chances</li>
                <li>Customize your resume for each application</li>
                <li>Set reminders to follow up</li>
                <li>Track your application status here</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedJobs;