// JobFilters.jsx
import React, { useState } from 'react';
import './JobFilters.css';

const JobFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    jobType: 'all',
    experienceLevel: 'all',
    remoteOnly: false,
    minSalary: 0,
    maxSalary: 100000,
    postedWithin: '24',
    salaryPreset: 'all'
  });

  const jobTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'internship', label: 'Internship' }
  ];

  const experienceLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'executive', label: 'Executive' }
  ];

  const salaryPresets = [
    { value: 'all', label: 'All', range: [0, 200000] },
    { value: 'under-50k', label: 'Under $50k', range: [0, 50000] },
    { value: '50k-100k', label: '$50k-$100k', range: [50000, 100000] },
    { value: '100k-150k', label: '$100k-$150k', range: [100000, 150000] },
    { value: 'over-150k', label: 'Over $150k', range: [150000, 200000] }
  ];

  const postedWithinOptions = [
    { value: '24', label: 'Last 24 hours' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: 'all', label: 'All time' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    
    // If salary preset changes, update min and max salary
    if (key === 'salaryPreset' && value !== 'all') {
      const preset = salaryPresets.find(p => p.value === value);
      if (preset) {
        newFilters.minSalary = preset.range[0];
        newFilters.maxSalary = preset.range[1];
      }
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSalaryInputChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    const newFilters = { 
      ...filters, 
      [type]: numValue,
      salaryPreset: 'custom' // Set to custom when manually adjusting
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      jobType: 'all',
      experienceLevel: 'all',
      remoteOnly: false,
      minSalary: 0,
      maxSalary: 100000,
      postedWithin: '24',
      salaryPreset: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const removeActiveFilter = (filterType) => {
    const defaultValues = {
      jobType: 'all',
      experienceLevel: 'all',
      remoteOnly: false,
      postedWithin: '24',
      salaryPreset: 'all',
      minSalary: 0,
      maxSalary: 100000
    };
    
    const newFilters = { ...filters, [filterType]: defaultValues[filterType] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const active = [];
    
    if (filters.jobType !== 'all') {
      const jobType = jobTypes.find(j => j.value === filters.jobType);
      active.push({ type: 'jobType', label: jobType?.label || filters.jobType });
    }
    
    if (filters.experienceLevel !== 'all') {
      const expLevel = experienceLevels.find(e => e.value === filters.experienceLevel);
      active.push({ type: 'experienceLevel', label: expLevel?.label || filters.experienceLevel });
    }
    
    if (filters.postedWithin !== '24') {
      const posted = postedWithinOptions.find(p => p.value === filters.postedWithin);
      active.push({ type: 'postedWithin', label: posted?.label || filters.postedWithin });
    }
    
    if (filters.remoteOnly) {
      active.push({ type: 'remoteOnly', label: 'Remote Only' });
    }
    
    if (filters.salaryPreset !== 'all' && filters.salaryPreset !== 'custom') {
      const salary = salaryPresets.find(s => s.value === filters.salaryPreset);
      active.push({ type: 'salaryPreset', label: salary?.label || 'Custom Salary' });
    } else if (filters.minSalary > 0 || filters.maxSalary < 200000) {
      active.push({ 
        type: 'salary', 
        label: `$${filters.minSalary.toLocaleString()} - $${filters.maxSalary.toLocaleString()}` 
      });
    }
    
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
  <div className="job-filters-container">
    <div className="filters-header">
      <h3>🔍 Filters</h3>
      <button onClick={clearFilters} className="clear-filters-btn">
        Clear All
      </button>
    </div>
    
    {/* Add this wrapper div for scrollable content */}
    <div className="filters-content">
      <div className="filter-group">
        <label className="filter-label">Job Type</label>
        <div className="filter-options">
          {jobTypes.map(type => (
            <div
              key={type.value}
              className={`filter-option ${filters.jobType === type.value ? 'active' : ''}`}
              onClick={() => handleFilterChange('jobType', type.value)}
            >
              {type.label}
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-group">
        <label className="filter-label">Experience Level</label>
        <div className="filter-options">
          {experienceLevels.map(level => (
            <div
              key={level.value}
              className={`filter-option ${filters.experienceLevel === level.value ? 'active' : ''}`}
              onClick={() => handleFilterChange('experienceLevel', level.value)}
            >
              {level.label}
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-group">
        <label className="filter-label">Salary Range</label>
        <div className="salary-range-inputs">
          <div className="salary-input">
            <span className="currency">$</span>
            <input
              type="number"
              value={filters.minSalary}
              onChange={(e) => handleSalaryInputChange('minSalary', e.target.value)}
              min="0"
              max="200000"
              placeholder="0"
            />
          </div>
          <span className="range-separator">to</span>
          <div className="salary-input">
            <span className="currency">$</span>
            <input
              type="number"
              value={filters.maxSalary}
              onChange={(e) => handleSalaryInputChange('maxSalary', e.target.value)}
              min="0"
              max="200000"
              placeholder="100000"
            />
          </div>
        </div>
        <div className="salary-presets">
          {salaryPresets.map(preset => (
            <div
              key={preset.value}
              className={`salary-preset ${
                filters.salaryPreset === preset.value ||
                (preset.value === 'all' && filters.minSalary === 0 && filters.maxSalary === 200000) ||
                (preset.value === 'under-50k' && filters.minSalary === 0 && filters.maxSalary === 50000) ||
                (preset.value === '50k-100k' && filters.minSalary === 50000 && filters.maxSalary === 100000) ||
                (preset.value === '100k-150k' && filters.minSalary === 100000 && filters.maxSalary === 150000) ||
                (preset.value === 'over-150k' && filters.minSalary === 150000 && filters.maxSalary === 200000)
                  ? 'active' : ''
              }`}
              onClick={() => handleFilterChange('salaryPreset', preset.value)}
            >
              {preset.label}
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-group">
        <label className="filter-label">Posted Within</label>
        <div className="filter-options">
          {postedWithinOptions.map(option => (
            <div
              key={option.value}
              className={`filter-option ${filters.postedWithin === option.value ? 'active' : ''}`}
              onClick={() => handleFilterChange('postedWithin', option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-group">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.remoteOnly}
            onChange={(e) => handleFilterChange('remoteOnly', e.target.checked)}
          />
          <span className="checkbox-label">🌎 Remote Jobs Only</span>
        </label>
      </div>
    </div>
    {/* End of filters-content */}
    
    {activeFilters.length > 0 && (
      <div className="active-filters">
        <h4>Active Filters:</h4>
        <div className="active-filters-list">
          {activeFilters.map((filter, index) => (
            <div key={index} className="active-filter-tag">
              {filter.label}
              <button onClick={() => removeActiveFilter(filter.type)}>×</button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
};

export default JobFilters;