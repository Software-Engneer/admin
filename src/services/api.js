import config from '../config';

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // File upload request method
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData, // Don't set Content-Type for FormData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Projects API
  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', projectData.title);
    formData.append('description', projectData.description);
    formData.append('technologies', projectData.technologies);
    
    // Add image file
    if (projectData.image) {
      formData.append('image', projectData.image);
    }
    
    return this.uploadFile('/projects', formData);
  }

  async updateProject(id, projectData) {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', projectData.title);
    formData.append('description', projectData.description);
    formData.append('technologies', projectData.technologies);
    
    // Add image file if provided
    if (projectData.image) {
      formData.append('image', projectData.image);
    }
    
    const url = `${this.baseURL}/projects/${id}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Project update failed:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  // Creative Works API
  async getCreativeWorks() {
    return this.request('/creative');
  }

  async getCreativeWork(id) {
    return this.request(`/creative/${id}`);
  }

  async createCreativeWork(creativeData) {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', creativeData.title);
    formData.append('description', creativeData.description);
    formData.append('mediums', creativeData.mediums);
    
    // Add image file
    if (creativeData.image) {
      formData.append('image', creativeData.image);
    }
    
    return this.uploadFile('/creative', formData);
  }

  async updateCreativeWork(id, creativeData) {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', creativeData.title);
    formData.append('description', creativeData.description);
    formData.append('mediums', creativeData.mediums);
    
    // Add image file if provided
    if (creativeData.image) {
      formData.append('image', creativeData.image);
    }
    
    const url = `${this.baseURL}/creative/${id}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Creative work update failed:', error);
      throw error;
    }
  }

  async deleteCreativeWork(id) {
    return this.request(`/creative/${id}`, { method: 'DELETE' });
  }

  // Contact messages API
  async getContactMessages() {
    return this.request('/contact');
  }

  async deleteContactMessage(id) {
    return this.request(`/contact/${id}`, { method: 'DELETE' });
  }

  // Dashboard stats
  async getDashboardStats() {
    try {
      const [projects, creativeWorks, contactMessages] = await Promise.all([
        this.getProjects(),
        this.getCreativeWorks(),
        this.getContactMessages(),
      ]);

      return {
        totalProjects: projects.length,
        totalCreativeWorks: creativeWorks.length,
        totalMessages: contactMessages.length,
        totalViews: 0, // This would need to be implemented on the backend
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        totalProjects: 0,
        totalCreativeWorks: 0,
        totalMessages: 0,
        totalViews: 0,
      };
    }
  }
}

export default new ApiService(); 