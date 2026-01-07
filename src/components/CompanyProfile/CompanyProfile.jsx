// src/components/CompanyProfile/CompanyProfile.jsx
import React, { useState, useEffect } from 'react';
import './CompanyProfile.css';

// Sample companies data (in real app, fetch from API)
const sampleCompanies = [
  {
    id: 1,
    name: 'Tech Corp',
    logo: '🏢',
    description: 'Leading technology company specializing in innovative software solutions.',
    location: 'San Francisco, CA',
    employees: '5000+',
    founded: '2010',
    industry: 'Technology',
    website: 'https://techcorp.com',
    rating: 4.5,
    reviews: 1240,
    jobs: [
      { id: 101, title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote' },
      { id: 102, title: 'Backend Engineer', type: 'Full-time', location: 'San Francisco' },
      { id: 103, title: 'Product Manager', type: 'Full-time', location: 'Hybrid' }
    ]
  },
  {
    id: 2,
    name: 'Design Studio',
    logo: '🎨',
    description: 'Creative agency focused on UI/UX design and digital experiences.',
    location: 'New York, NY',
    employees: '200',
    founded: '2015',
    industry: 'Design',
    website: 'https://designstudio.com',
    rating: 4.2,
    reviews: 560,
    jobs: [
      { id: 201, title: 'UI/UX Designer', type: 'Full-time', location: 'New York' },
      { id: 202, title: 'Creative Director', type: 'Full-time', location: 'Remote' }
    ]
  }
];

const CompanyProfile = ({ companyId }) => {
  const [company, setCompany] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In real app, fetch company data by ID
    const foundCompany = sampleCompanies.find(c => c.id === parseInt(companyId));
    setCompany(foundCompany || sampleCompanies[0]);
  }, [companyId]);

  if (!company) {
    return <div className="loading">Loading company profile...</div>;
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // In real app, make API call
  };

  return (
    <div className="company-profile-container">
      {/* Company Header */}
      <div className="company-header">
        <div className="company-logo-section">
          <div className="company-logo">{company.logo}</div>
          <div className="company-basic-info">
            <h1>{company.name}</h1>
            <div className="company-tags">
              <span className="company-tag">{company.industry}</span>
              <span className="company-tag">{company.employees} employees</span>
              <span className="company-tag rating-tag">
                ⭐ {company.rating} ({company.reviews.toLocaleString()} reviews)
              </span>
            </div>
          </div>
        </div>
        <div className="company-actions">
          <button 
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
          >
            {isFollowing ? '✓ Following' : '+ Follow Company'}
          </button>
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="website-btn">
            🌐 Visit Website
          </a>
        </div>
      </div>

      {/* Company Tabs */}
      <div className="company-tabs">
        <button 
          className={`company-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button 
          className={`company-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          💼 Open Jobs ({company.jobs.length})
        </button>
        <button 
          className={`company-tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Reviews
        </button>
        <button 
          className={`company-tab ${activeTab === 'culture' ? 'active' : ''}`}
          onClick={() => setActiveTab('culture')}
        >
          🏢 Culture
        </button>
      </div>

      {/* Tab Content */}
      <div className="company-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="company-details">
              <h3>About {company.name}</h3>
              <p>{company.description}</p>
              
              <div className="company-stats-grid">
                <div className="company-stat">
                  <div className="stat-icon">📍</div>
                  <div className="stat-content">
                    <h4>Location</h4>
                    <p>{company.location}</p>
                  </div>
                </div>
                <div className="company-stat">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h4>Company Size</h4>
                    <p>{company.employees} employees</p>
                  </div>
                </div>
                <div className="company-stat">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <h4>Founded</h4>
                    <p>{company.founded}</p>
                  </div>
                </div>
                <div className="company-stat">
                  <div className="stat-icon">🏭</div>
                  <div className="stat-content">
                    <h4>Industry</h4>
                    <p>{company.industry}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-tab">
            <h3>Open Positions at {company.name}</h3>
            <div className="company-jobs-list">
              {company.jobs.map((job) => (
                <div key={job.id} className="company-job-card">
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <div className="job-meta">
                      <span className="job-type">{job.type}</span>
                      <span className="job-location">📍 {job.location}</span>
                    </div>
                  </div>
                  <button className="apply-btn">Apply Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <h3>Employee Reviews</h3>
            <div className="rating-summary">
              <div className="overall-rating">
                <div className="rating-number">{company.rating}</div>
                <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                <div className="rating-count">{company.reviews.toLocaleString()} reviews</div>
              </div>
              <div className="rating-details">
                <p>💬 "Great company culture and work-life balance"</p>
                <p>💬 "Innovative projects and talented team"</p>
                <p>💬 "Good growth opportunities"</p>
              </div>
            </div>
            <button className="add-review-btn">Add Your Review</button>
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="culture-tab">
            <h3>Company Culture</h3>
            <div className="culture-features">
              <div className="culture-feature">
                <div className="feature-icon">🤝</div>
                <h4>Team Collaboration</h4>
                <p>Strong emphasis on teamwork and cross-functional collaboration</p>
              </div>
              <div className="culture-feature">
                <div className="feature-icon">🚀</div>
                <h4>Innovation</h4>
                <p>Encourages innovation and creative problem-solving</p>
              </div>
              <div className="culture-feature">
                <div className="feature-icon">⚖️</div>
                <h4>Work-Life Balance</h4>
                <p>Flexible hours and remote work options</p>
              </div>
              <div className="culture-feature">
                <div className="feature-icon">📚</div>
                <h4>Learning & Growth</h4>
                <p>Training programs and career development opportunities</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;