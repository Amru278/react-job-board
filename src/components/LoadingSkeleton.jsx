// src/components/LoadingSkeleton.jsx
import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const skeletons = Array(count).fill(0);
  
  const getSkeleton = (key) => {
    switch(type) {
      case 'card':
        return (
          <div key={key} className="skeleton-card">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-text"></div>
            <div className="skeleton-line skeleton-button"></div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div key={key} className="skeleton-dashboard">
            <div className="skeleton-header">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-user-info">
                <div className="skeleton-line skeleton-name"></div>
                <div className="skeleton-line skeleton-title"></div>
              </div>
            </div>
            <div className="skeleton-stats">
              <div className="skeleton-stat"></div>
              <div className="skeleton-stat"></div>
              <div className="skeleton-stat"></div>
              <div className="skeleton-stat"></div>
            </div>
            <div className="skeleton-activity">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        );
      
      case 'job':
        return (
          <div key={key} className="skeleton-job">
            <div className="skeleton-job-header">
              <div className="skeleton-badges">
                <div className="skeleton-badge"></div>
                <div className="skeleton-badge"></div>
              </div>
              <div className="skeleton-save-btn"></div>
            </div>
            <div className="skeleton-line skeleton-job-title"></div>
            <div className="skeleton-line skeleton-company"></div>
            <div className="skeleton-job-meta">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
            <div className="skeleton-line skeleton-description"></div>
            <div className="skeleton-job-actions">
              <div className="skeleton-btn"></div>
              <div className="skeleton-btn"></div>
            </div>
          </div>
        );
      
      default:
        return <div key={key} className="skeleton-line"></div>;
    }
  };

  return (
    <div className="loading-skeleton">
      {skeletons.map((_, index) => getSkeleton(index))}
    </div>
  );
};

export default LoadingSkeleton;