import React, { useState, useEffect } from 'react';

const JobAlertsSection = () => {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    keyword: '',
    location: '',
    jobType: 'all',
    frequency: 'daily'
  });

  useEffect(() => {
    const savedAlerts = localStorage.getItem('jobAlerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  const createAlert = () => {
    const alert = {
      id: Date.now(),
      ...newAlert,
      created: new Date().toISOString(),
      active: true
    };
    
    const updatedAlerts = [...alerts, alert];
    setAlerts(updatedAlerts);
    localStorage.setItem('jobAlerts', JSON.stringify(updatedAlerts));
    
    setNewAlert({
      keyword: '',
      location: '',
      jobType: 'all',
      frequency: 'daily'
    });
    
    alert('Job alert created successfully!');
  };

  const toggleAlert = (id) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('jobAlerts', JSON.stringify(updatedAlerts));
  };

  const deleteAlert = (id) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
    localStorage.setItem('jobAlerts', JSON.stringify(updatedAlerts));
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Job Alerts</h2>
      </div>
      
      <div className="alert-form">
        <h3>Create New Alert</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Keyword</label>
            <input
              type="text"
              value={newAlert.keyword}
              onChange={(e) => setNewAlert({...newAlert, keyword: e.target.value})}
              placeholder="Job title, skills, or company"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={newAlert.location}
              onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
              placeholder="City, state, or remote"
            />
          </div>
          <div className="form-group">
            <label>Job Type</label>
            <select
              value={newAlert.jobType}
              onChange={(e) => setNewAlert({...newAlert, jobType: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <div className="form-group">
            <label>Frequency</label>
            <select
              value={newAlert.frequency}
              onChange={(e) => setNewAlert({...newAlert, frequency: e.target.value})}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="instant">Instant</option>
            </select>
          </div>
        </div>
        <button onClick={createAlert} className="btn-primary">Create Alert</button>
      </div>
      
      <div className="alerts-list">
        <h3>Your Alerts ({alerts.length})</h3>
        {alerts.length === 0 ? (
          <p className="no-alerts">No job alerts yet. Create one to get notified about new jobs!</p>
        ) : (
          <div className="alerts-grid">
            {alerts.map(alert => (
              <div key={alert.id} className="alert-card">
                <div className="alert-header">
                  <h4>🔔 {alert.keyword || 'Any job'}</h4>
                  <div className="alert-actions">
                    <button 
                      onClick={() => toggleAlert(alert.id)}
                      className={`toggle-btn ${alert.active ? 'active' : ''}`}
                    >
                      {alert.active ? 'ON' : 'OFF'}
                    </button>
                    <button 
                      onClick={() => deleteAlert(alert.id)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="alert-details">
                  <p><strong>Location:</strong> {alert.location || 'Anywhere'}</p>
                  <p><strong>Type:</strong> {alert.jobType === 'all' ? 'All types' : alert.jobType}</p>
                  <p><strong>Frequency:</strong> {alert.frequency}</p>
                  <p><strong>Created:</strong> {new Date(alert.created).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlertsSection;