import React, { useState, useEffect } from 'react';
import { auth } from '../auth';
import JobFilters from './JobFilters.jsx';
import './JobBoard.css';

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const user = auth.getCurrentUser();

  const jobs = [
    { 
      id: 1, 
      title: 'Frontend Developer', 
      company: 'Tech Corp', 
      location: 'Bangalore',
      salary: '$60k - $80k',
      type: 'Full-time',
      experience: 'Mid',
      remote: false,
      postedDate: '2024-01-05',
      description: 'We are looking for a Frontend Developer with React experience...'
    },
    { 
      id: 2, 
      title: 'Backend Engineer', 
      company: 'Innovate Ltd', 
      location: 'Hyderabad',
      salary: '$70k - $90k',
      type: 'Full-time',
      experience: 'Senior',
      remote: false,
      postedDate: '2024-01-04',
      description: 'Join our backend team to build scalable APIs...'
    },
    { 
      id: 3, 
      title: 'Full Stack Developer', 
      company: 'Web Solutions', 
      location: 'Tumkur',
      salary: '$50k - $70k',
      type: 'Contract',
      experience: 'Mid',
      remote: false,
      postedDate: '2024-01-03',
      description: 'Full stack developer needed for a 6-month project...'
    },
    { 
      id: 4, 
      title: 'UI/UX Designer', 
      company: 'Design Studio', 
      location: 'Bangalore',
      salary: '$55k - $75k',
      type: 'Full-time',
      experience: 'Entry',
      remote: false,
      postedDate: '2024-01-02',
      description: 'Creative designer needed for our product team...'
    },
    { 
      id: 5, 
      title: 'Junior React Developer', 
      company: 'Startup Inc', 
      location: 'Remote',
      salary: '$45k - $65k',
      type: 'Full-time',
      experience: 'Entry',
      remote: true,
      postedDate: '2024-01-01',
      description: 'Perfect entry-level position for React beginners...'
    },
    { 
      id: 6, 
      title: 'Senior DevOps Engineer', 
      company: 'Cloud Tech', 
      location: 'Chennai',
      salary: '$80k - $110k',
      type: 'Full-time',
      experience: 'Senior',
      remote: true,
      postedDate: '2023-12-28',
      description: 'Looking for DevOps engineer with AWS experience...'
    },
    { 
      id: 7, 
      title: 'Data Scientist', 
      company: 'Analytics Pro', 
      location: 'Mumbai',
      salary: '$75k - $95k',
      type: 'Full-time',
      experience: 'Mid',
      remote: false,
      postedDate: '2023-12-25',
      description: 'Join our data science team to build predictive models...'
    },
    { 
      id: 8, 
      title: 'Product Manager', 
      company: 'Product Labs', 
      location: 'Remote',
      salary: '$90k - $120k',
      type: 'Full-time',
      experience: 'Senior',
      remote: true,
      postedDate: '2023-12-20',
      description: 'Lead product development for our flagship product...'
    }
  ];

  // Move the helper function to the top, before filteredJobs
  const isWithinDays = (dateString, days) => {
    if (days === 'all') return true;
    const jobDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  };

  useEffect(() => {
    if (user) {
      setSavedJobs(auth.getSavedJobs());
    }
  }, [user]);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const toggleSaveJob = (jobId) => {
    if (!user) {
      alert('Please login to save jobs');
      return;
    }
    
    if (savedJobs.includes(jobId)) {
      auth.removeSavedJob(jobId);
      setSavedJobs(prev => prev.filter(id => id !== jobId));
    } else {
      auth.saveJob(jobId);
      setSavedJobs(prev => [...prev, jobId]);
    }
  };

  // Now isWithinDays is available when filteredJobs is computed
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Job type filter (convert to lowercase for comparison)
    const matchesJobType = 
      !activeFilters.jobType || 
      activeFilters.jobType === 'all' || 
      job.type.toLowerCase().replace('-', ' ') === activeFilters.jobType.toLowerCase();
    
    // Experience level filter
    const matchesExperience = 
      !activeFilters.experienceLevel || 
      activeFilters.experienceLevel === 'all' || 
      job.experience.toLowerCase() === activeFilters.experienceLevel.toLowerCase();
    
    // Remote filter
    const matchesRemote = 
      !activeFilters.remoteOnly || 
      job.remote === true;
    
    // Salary filter
    const salaryNumber = parseInt(job.salary.replace(/[^0-9]/g, '')) || 0;
    const matchesSalary = 
      (!activeFilters.minSalary && !activeFilters.maxSalary) ||
      (salaryNumber >= (activeFilters.minSalary || 0) && 
       salaryNumber <= (activeFilters.maxSalary || 200000));
    
    // Posted within filter
    const matchesPostedWithin = 
      !activeFilters.postedWithin || 
      activeFilters.postedWithin === 'all' ||
      isWithinDays(job.postedDate, parseInt(activeFilters.postedWithin));
    
    return matchesSearch && matchesJobType && matchesExperience && 
           matchesRemote && matchesSalary && matchesPostedWithin;
  });

  const applyForJob = (job) => {
    if (!user) {
      alert('Please login to apply for jobs');
      return;
    }
    
    const jobData = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary
    };
    
    if (auth.addApplication(jobData)) {
      alert(`Successfully applied for ${job.title} at ${job.company}!`);
    } else {
      alert('Failed to apply. Please try again.');
    }
  };

  return (
    <div className="job-board-container">
      <div className="job-board-header">
        <h1>🎯 Find Your Dream Job</h1>
        <p>Welcome back, {user?.name || 'Job Seeker'}! Explore {jobs.length} opportunities</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by job title, company, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="search-stats">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </div>
      </div>
      
      <div className="job-board-layout">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <JobFilters onFilterChange={handleFilterChange} />
        </div>
        
        {/* Jobs List */}
        <div className="jobs-list-section">
          {filteredJobs.length === 0 ? (
            <div className="no-results">
              <h3>No jobs found 😔</h3>
              <p>Try adjusting your search terms or filters</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilters({});
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="jobs-list">
              {filteredJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <div className="job-badges">
                      {job.type === 'Full-time' && <span className="badge full-time">Full-time</span>}
                      {job.type === 'Contract' && <span className="badge contract">Contract</span>}
                      {job.remote && <span className="badge remote">🌎 Remote</span>}
                      {job.experience === 'Senior' && <span className="badge senior">Senior</span>}
                      {job.experience === 'Entry' && <span className="badge entry">Entry Level</span>}
                      {savedJobs.includes(job.id) && <span className="badge saved">❤️ Saved</span>}
                    </div>
                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className={`save-btn ${savedJobs.includes(job.id) ? 'saved' : ''}`}
                    >
                      {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                  
                  <h3 className="job-title" onClick={() => setSelectedJob(job)}>
                    {job.title}
                  </h3>
                  
                  <div className="job-company">
                    <span className="company-name">{job.company}</span>
                    <span className="job-location">📍 {job.location}</span>
                  </div>
                  
                  <div className="job-meta">
                    <span className="job-salary">💰 {job.salary}</span>
                    <span className="job-experience">👤 {job.experience} Level</span>
                    <span className="job-posted">📅 {new Date(job.postedDate).toLocaleDateString()}</span>
                  </div>
                  
                  <p className="job-description">
                    {job.description.substring(0, 120)}...
                  </p>
                  
                  <div className="job-actions">
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => applyForJob(job)}
                      className="apply-btn"
                    >
                      Quick Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <div className="job-details-modal">
          <div className="modal-content">
            <button 
              onClick={() => setSelectedJob(null)}
              className="modal-close-btn"
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h2>{selectedJob.title}</h2>
              <div className="modal-badges">
                <span className="badge">{selectedJob.type}</span>
                <span className="badge">📍 {selectedJob.location}</span>
                {selectedJob.remote && <span className="badge remote">🌎 Remote</span>}
                <span className="badge">{selectedJob.experience} Level</span>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>🏢 Company</h3>
                <p>{selectedJob.company}</p>
              </div>
              
              <div className="detail-section">
                <h3>💰 Salary Range</h3>
                <p>{selectedJob.salary}</p>
              </div>
              
              <div className="detail-section">
                <h3>📅 Posted Date</h3>
                <p>{new Date(selectedJob.postedDate).toLocaleDateString()}</p>
              </div>
              
              <div className="detail-section">
                <h3>📝 Job Description</h3>
                <p>{selectedJob.description}</p>
              </div>
              
              <div className="detail-section">
                <h3>✅ Requirements</h3>
                <ul>
                  <li>Experience with modern JavaScript frameworks</li>
                  <li>Good problem-solving skills</li>
                  <li>Ability to work in a team environment</li>
                  <li>Strong communication skills</li>
                </ul>
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={() => applyForJob(selectedJob)}
                  className="apply-now-btn"
                >
                  Apply Now
                </button>
                <button 
                  onClick={() => {
                    toggleSaveJob(selectedJob.id);
                    setSelectedJob(null);
                  }}
                  className={`save-modal-btn ${savedJobs.includes(selectedJob.id) ? 'saved' : ''}`}
                >
                  {savedJobs.includes(selectedJob.id) ? '❤️ Job Saved' : '♡ Save Job'}
                </button>
                <button 
                  onClick={() => {
                    // Navigate to company profile
                    window.location.href = `/company/${selectedJob.id}`;
                  }}
                  className="company-profile-btn"
                >
                  🏢 View Company Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;