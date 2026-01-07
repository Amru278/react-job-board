import React, { useState, useEffect } from 'react';
import { auth } from '../../auth';
import './Dashboard.css'; // We'll add more styles

const Profile = ({ user, setUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    jobTitle: '',
    experience: '',
    profilePic: ''
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: '',
    field: '',
    university: '',
    year: ''
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        jobTitle: user.jobTitle || '',
        experience: user.experience || '',
        profilePic: user.profilePic || ''
      });
      setSkills(user.skills || []);
      setInterests(user.interests || []);
      setEducation(user.education || []);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation({ ...newEducation, [name]: value });
  };

  const handleSaveProfile = () => {
    const updates = {
      ...formData,
      skills,
      interests,
      education,
      updatedAt: new Date().toISOString()
    };
    
    if (auth.updateProfile(updates)) {
      const updatedUser = auth.getCurrentUser();
      setUser(updatedUser);
      setEditMode(false);
      alert('Profile updated successfully!');
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        if (auth.uploadProfilePic(base64String)) {
          setFormData({ ...formData, profilePic: base64String });
          const updatedUser = auth.getCurrentUser();
          setUser(updatedUser);
          alert('Profile picture updated!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      auth.updateProfile({ skills: updatedSkills });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    auth.updateProfile({ skills: updatedSkills });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      auth.updateProfile({ interests: updatedInterests });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    const updatedInterests = interests.filter(interest => interest !== interestToRemove);
    setInterests(updatedInterests);
    auth.updateProfile({ interests: updatedInterests });
  };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.university) {
      const newEdu = {
        id: Date.now(),
        ...newEducation
      };
      const updatedEducation = [...education, newEdu];
      setEducation(updatedEducation);
      auth.updateProfile({ education: updatedEducation });
      setNewEducation({
        degree: '',
        field: '',
        university: '',
        year: ''
      });
    }
  };

  const handleRemoveEducation = (id) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    setEducation(updatedEducation);
    auth.updateProfile({ education: updatedEducation });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (auth.uploadResume(file.name)) {
        setResumeFile(file);
        const updatedUser = auth.getCurrentUser();
        setUser(updatedUser);
        alert('Resume uploaded successfully!');
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-actions">
          {editMode ? (
            <>
              <button onClick={handleSaveProfile} className="btn-primary">
                Save Changes
              </button>
              <button onClick={() => setEditMode(false)} className="btn-secondary">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="btn-primary">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        {/* Basic Info Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Basic Information</h2>
          </div>
          <div className="card-content">
            <div className="profile-pic-section">
              <div className="profile-pic-container">
                {formData.profilePic ? (
                  <img src={formData.profilePic} alt="Profile" className="profile-pic" />
                ) : (
                  <div className="profile-pic-placeholder">
                    {formData.name?.charAt(0) || 'U'}
                  </div>
                )}
                {editMode && (
                  <label className="upload-pic-btn">
                    📷 Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                  placeholder="Your email"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="City, Country"
                />
              </div>

              <div className="form-group">
                <label>Current Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="e.g., Frontend Developer"
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="e.g., 2 years"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Bio/About Me</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!editMode}
                placeholder="Tell us about yourself, your career goals, etc."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Skills</h2>
          </div>
          <div className="card-content">
            <div className="skills-container">
              {skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                  {editMode && (
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {editMode && (
              <div className="add-skill-form">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button onClick={handleAddSkill} className="btn-small">
                  Add Skill
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Interests Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Interests & Areas</h2>
          </div>
          <div className="card-content">
            <div className="interests-container">
              {interests.map((interest, index) => (
                <div key={index} className="interest-tag">
                  {interest}
                  {editMode && (
                    <button 
                      onClick={() => handleRemoveInterest(interest)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {editMode && (
              <div className="add-interest-form">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add a new interest (e.g., AI, Web3, UI/UX)"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                />
                <button onClick={handleAddInterest} className="btn-small">
                  Add Interest
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Education Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Education</h2>
          </div>
          <div className="card-content">
            {education.length > 0 ? (
              <div className="education-list">
                {education.map((edu) => (
                  <div key={edu.id} className="education-item">
                    <div className="education-header">
                      <h3>{edu.degree} in {edu.field}</h3>
                      {editMode && (
                        <button 
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <p className="education-university">{edu.university}</p>
                    <p className="education-year">{edu.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-education">No education added yet.</p>
            )}
            
            {editMode && (
              <div className="add-education-form">
                <h3>Add Education</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={newEducation.degree}
                      onChange={handleEducationChange}
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input
                      type="text"
                      name="field"
                      value={newEducation.field}
                      onChange={handleEducationChange}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>University</label>
                    <input
                      type="text"
                      name="university"
                      value={newEducation.university}
                      onChange={handleEducationChange}
                      placeholder="University name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      name="year"
                      value={newEducation.year}
                      onChange={handleEducationChange}
                      placeholder="e.g., 2022"
                    />
                  </div>
                </div>
                <button onClick={handleAddEducation} className="btn-small">
                  Add Education
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resume Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Resume</h2>
          </div>
          <div className="card-content">
            {user?.resume ? (
              <div className="resume-info">
                <div className="resume-icon">📄</div>
                <div className="resume-details">
                  <h3>{user.resume.fileName}</h3>
                  <p>Uploaded on {new Date(user.resume.uploadDate).toLocaleDateString()}</p>
                </div>
                {editMode && (
                  <div className="resume-actions">
                    <label className="btn-secondary">
                      Replace Resume
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-resume-prompt">
                <p>Upload your resume to increase your chances of getting hired!</p>
                {editMode && (
                  <label className="btn-primary">
                    📄 Upload Resume
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;