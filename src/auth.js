// Complete Authentication and User Profile Utility
export const auth = {
  // Demo users data with extended profile
  demoUsers: [
    { 
      id: 1, 
      email: 'user@example.com', 
      password: 'password123', 
      name: 'John Doe', 
      savedJobs: [1, 2],
      appliedJobs: [
        {
          id: 101,
          jobId: 1,
          jobTitle: 'Frontend Developer',
          company: 'Tech Corp',
          appliedDate: '2024-01-10',
          status: 'Applied'
        }
      ],
      profilePic: '',
      phone: '+1 234-567-8900',
      bio: 'Passionate frontend developer with 2 years of experience',
      resume: {
        fileName: 'john_doe_resume.pdf',
        fileSize: '2.5 MB',
        uploadDate: '2024-01-05T10:30:00Z',
        fileType: 'application/pdf',
        lastUpdated: '2024-01-05T10:30:00Z'
      },
      education: [
        {
          id: 1,
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          university: 'Tech University',
          year: '2022'
        }
      ],
      skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Git'],
      interests: ['Web Development', 'UI/UX Design', 'Open Source'],
      location: 'Bangalore, India',
      jobTitle: 'Frontend Developer',
      experience: '2 years'
    },
    { 
      id: 2, 
      email: 'alice@example.com', 
      password: 'password123', 
      name: 'Alice Smith', 
      savedJobs: [3],
      appliedJobs: [],
      profilePic: '',
      phone: '',
      bio: '',
      resume: null,
      education: [],
      skills: [],
      interests: [],
      location: '',
      jobTitle: '',
      experience: ''
    }
  ],

  // Initialize users in localStorage
  initUsers() {
    if (!localStorage.getItem('jobboard_users')) {
      localStorage.setItem('jobboard_users', JSON.stringify(this.demoUsers));
    }
  },

  // ========== AUTHENTICATION FUNCTIONS ==========
  
  // Login user
  login(email, password) {
    this.initUsers();
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Don't store password in session
      const { password, ...userWithoutPassword } = user;
      
      // FIX: Changed from 'current_user' to 'currentUser'
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      // Also update in users array
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = userWithoutPassword;
        localStorage.setItem('jobboard_users', JSON.stringify(users));
      }
      
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, message: 'Invalid email or password' };
  },

  // Sign up new user
  signup(email, password, name) {
    this.initUsers();
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
      savedJobs: [],
      appliedJobs: [],
      profilePic: '',
      phone: '',
      bio: '',
      resume: null,
      education: [],
      skills: [],
      interests: [],
      location: '',
      jobTitle: '',
      experience: '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('jobboard_users', JSON.stringify(users));
    
    // Auto login
    const { password: _, ...userWithoutPassword } = newUser;
    
    // FIX: Changed from 'current_user' to 'currentUser'
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  },

  // Get current user - FIXED: Changed from 'current_user' to 'currentUser'
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in - FIXED: Changed from 'current_user' to 'currentUser'
  isLoggedIn() {
    return !!localStorage.getItem('currentUser');
  },

  // Logout user - FIXED: Changed from 'current_user' to 'currentUser'
  logout() {
    localStorage.removeItem('currentUser');
  },

  // ========== RESUME FUNCTIONS ==========

  // Upload resume - FIXED: Use 'currentUser'
  uploadResume(resumeData) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not logged in' };
    
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      const newResume = {
        fileName: resumeData.fileName,
        fileSize: resumeData.fileSize,
        fileType: resumeData.fileType,
        uploadDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Update in users array
      users[userIndex].resume = newResume;
      localStorage.setItem('jobboard_users', JSON.stringify(users));
      
      // Update current user session
      user.resume = newResume;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { 
        success: true, 
        message: 'Resume uploaded successfully',
        resume: newResume 
      };
    }
    return { success: false, message: 'User not found' };
  },

  // Update resume - FIXED: Use 'currentUser'
  updateResume(resumeData) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not logged in' };
    
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1 && users[userIndex].resume) {
      const updatedResume = {
        ...users[userIndex].resume,
        fileName: resumeData.fileName,
        fileSize: resumeData.fileSize,
        fileType: resumeData.fileType,
        lastUpdated: new Date().toISOString()
      };
      
      // Update in users array
      users[userIndex].resume = updatedResume;
      localStorage.setItem('jobboard_users', JSON.stringify(users));
      
      // Update current user session
      user.resume = updatedResume;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { 
        success: true, 
        message: 'Resume updated successfully',
        resume: updatedResume 
      };
    }
    return { success: false, message: 'Resume not found' };
  },

  // Delete resume - FIXED: Use 'currentUser'
  deleteResume() {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'User not logged in' };
    
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      // Update in users array
      delete users[userIndex].resume;
      localStorage.setItem('jobboard_users', JSON.stringify(users));
      
      // Update current user session
      delete user.resume;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { success: true, message: 'Resume deleted successfully' };
    }
    return { success: false, message: 'User not found' };
  },

  // Get resume
  getResume() {
    const user = this.getCurrentUser();
    return user ? user.resume : null;
  },

  // ========== JOB FUNCTIONS ==========
  
  // Save/unsave a job (toggle)
  saveJob(jobId) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      const savedJobs = users[userIndex].savedJobs || [];
      let newSavedJobs;
      
      if (savedJobs.includes(jobId)) {
        // Remove job if already saved
        newSavedJobs = savedJobs.filter(id => id !== jobId);
      } else {
        // Add job if not saved
        newSavedJobs = [...savedJobs, jobId];
      }
      
      // Update in users array
      users[userIndex].savedJobs = newSavedJobs;
      localStorage.setItem('jobboard_users', JSON.stringify(users));
      
      // Update current user session
      user.savedJobs = newSavedJobs;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return true;
    }
    return false;
  },

  // Get saved jobs
  getSavedJobs() {
    const user = this.getCurrentUser();
    return user ? (user.savedJobs || []) : [];
  },

  // Add job application
  addApplication(jobData) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      const application = {
        id: Date.now(),
        ...jobData,
        appliedDate: new Date().toISOString(),
        status: 'Applied'
      };
      
      if (!users[userIndex].appliedJobs) {
        users[userIndex].appliedJobs = [];
      }
      
      users[userIndex].appliedJobs.unshift(application);
      localStorage.setItem('jobboard_users', JSON.stringify(users));
      
      // Update current session
      if (!user.appliedJobs) user.appliedJobs = [];
      user.appliedJobs.unshift(application);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return true;
    }
    return false;
  },

  // Get applied jobs
  getAppliedJobs() {
    const user = this.getCurrentUser();
    return user ? (user.appliedJobs || []) : [];
  },

  // Update application status
  updateApplicationStatus(applicationId, status) {
    const user = this.getCurrentUser();
    if (!user || !user.appliedJobs) return false;
    
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      const appIndex = users[userIndex].appliedJobs.findIndex(app => app.id === applicationId);
      if (appIndex !== -1) {
        users[userIndex].appliedJobs[appIndex].status = status;
        localStorage.setItem('jobboard_users', JSON.stringify(users));
        
        // Update current session
        const currentAppIndex = user.appliedJobs.findIndex(app => app.id === applicationId);
        if (currentAppIndex !== -1) {
          user.appliedJobs[currentAppIndex].status = status;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        return true;
      }
    }
    return false;
  },

  // ========== PROFILE FUNCTIONS ==========
  
  // Update user profile
  updateProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const users = JSON.parse(localStorage.getItem('jobboard_users'));
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      // Update the user
      users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('jobboard_users', JSON.stringify(users));
      
      // Update current session
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return true;
    }
    return false;
  },

  // Upload profile picture
  uploadProfilePic(base64Image) {
    return this.updateProfile({ 
      profilePic: base64Image,
      profilePicUpdated: new Date().toISOString()
    });
  },

  // Add education
  addEducation(education) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const newEducation = {
      id: Date.now(),
      ...education
    };
    
    const currentEducation = user.education || [];
    return this.updateProfile({
      education: [...currentEducation, newEducation]
    });
  },

  // Update education
  updateEducation(educationId, updates) {
    const user = this.getCurrentUser();
    if (!user || !user.education) return false;
    
    const updatedEducation = user.education.map(edu => 
      edu.id === educationId ? { ...edu, ...updates } : edu
    );
    
    return this.updateProfile({ education: updatedEducation });
  },

  // Delete education
  deleteEducation(educationId) {
    const user = this.getCurrentUser();
    if (!user || !user.education) return false;
    
    const updatedEducation = user.education.filter(edu => edu.id !== educationId);
    return this.updateProfile({ education: updatedEducation });
  },

  // Add skill
  addSkill(skill) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const currentSkills = user.skills || [];
    if (!currentSkills.includes(skill)) {
      return this.updateProfile({
        skills: [...currentSkills, skill]
      });
    }
    return false;
  },

  // Remove skill
  removeSkill(skill) {
    const user = this.getCurrentUser();
    if (!user || !user.skills) return false;
    
    const updatedSkills = user.skills.filter(s => s !== skill);
    return this.updateProfile({ skills: updatedSkills });
  },

  // Add interest
  addInterest(interest) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const currentInterests = user.interests || [];
    if (!currentInterests.includes(interest)) {
      return this.updateProfile({
        interests: [...currentInterests, interest]
      });
    }
    return false;
  },

  // Remove interest
  removeInterest(interest) {
    const user = this.getCurrentUser();
    if (!user || !user.interests) return false;
    
    const updatedInterests = user.interests.filter(i => i !== interest);
    return this.updateProfile({ interests: updatedInterests });
  },

  // ========== STATS & ANALYTICS ==========
  
  // Get user statistics
  getUserStats() {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    return {
      savedJobs: (user.savedJobs || []).length,
      appliedJobs: (user.appliedJobs || []).length,
      profileCompletion: this.calculateProfileCompletion(user),
      totalSkills: (user.skills || []).length,
      totalEducation: (user.education || []).length
    };
  },

  // Calculate profile completion percentage - FIXED
  calculateProfileCompletion(user) {
    if (!user) return 0;
    
    let score = 0;
    const totalFields = 11;
    
    // Basic info (1 point each)
    if (user.name && user.name.trim()) score += 1;
    if (user.email && user.email.trim()) score += 1;
    if (user.phone && user.phone.trim()) score += 1;
    if (user.bio && user.bio.trim()) score += 1;
    if (user.location && user.location.trim()) score += 1;
    if (user.jobTitle && user.jobTitle.trim()) score += 1;
    if (user.experience && user.experience.trim()) score += 1;
    
    // Resume (2 points if exists)
    if (user.resume && user.resume.fileName) score += 2;
    
    // Skills & Education (1 point each if has at least one)
    if (user.skills && user.skills.length > 0) score += 1;
    if (user.education && user.education.length > 0) score += 1;
    
    // Profile pic (1 point)
    if (user.profilePic && user.profilePic.trim()) score += 1;
    
    // Calculate percentage (capped at 100)
    return Math.min(Math.round((score / totalFields) * 100), 100);
  },

  // Get profile strength (color based on completion)
  getProfileStrength() {
    const completion = this.calculateProfileCompletion(this.getCurrentUser());
    
    if (completion >= 80) return { level: 'Strong', color: '#10b981' };
    if (completion >= 50) return { level: 'Good', color: '#f59e0b' };
    return { level: 'Weak', color: '#ef4444' };
  },

  // Get recent activity
  getRecentActivity() {
    const user = this.getCurrentUser();
    if (!user) return [];
    
    const activities = [];
    
    // Add saved jobs activity
    const savedCount = (user.savedJobs || []).length;
    if (savedCount > 0) {
      activities.push({
        type: 'saved',
        message: `Saved ${savedCount} jobs`,
        date: new Date().toISOString(),
        icon: '💼'
      });
    }
    
    // Add applications activity
    const appliedCount = (user.appliedJobs || []).length;
    if (appliedCount > 0) {
      activities.push({
        type: 'applied',
        message: `Applied to ${appliedCount} jobs`,
        date: new Date().toISOString(),
        icon: '📝'
      });
    }
    
    // Add resume upload activity
    if (user.resume) {
      activities.push({
        type: 'resume',
        message: 'Uploaded resume',
        date: user.resume.uploadDate,
        icon: '📄'
      });
    }
    
    // Add profile update activity
    if (user.updatedAt) {
      activities.push({
        type: 'profile',
        message: 'Updated profile',
        date: user.updatedAt,
        icon: '👤'
      });
    }
    
    // Add login activity if no other activities
    if (activities.length === 0) {
      activities.push({
        type: 'login',
        message: 'Welcome! Start by exploring jobs',
        date: new Date().toISOString(),
        icon: '👋'
      });
    }
    
    // Sort by date (newest first) and return only 5 most recent
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  },

  // NEW: Check and fix localStorage consistency
  checkAndFixStorage() {
    this.initUsers();
    
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      // Make sure user exists in jobboard_users
      const users = JSON.parse(localStorage.getItem('jobboard_users'));
      const userExists = users.some(u => u.id === currentUser.id);
      
      if (!userExists) {
        // User doesn't exist in jobboard_users, add them
        users.push(currentUser);
        localStorage.setItem('jobboard_users', JSON.stringify(users));
      }
    }
    
    return currentUser;
  }
};