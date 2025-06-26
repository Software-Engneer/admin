import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import styles from './Dashboard.module.css';
import Modal from './Modal';
import EditProjectForm from './EditProjectForm';
import EditCreativeForm from './EditCreativeForm';
import Notification from './Notification';
import apiService from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal states
  const [isAddProjectOpen, setAddProjectOpen] = useState(false);
  const [isAddCreativeOpen, setAddCreativeOpen] = useState(false);
  const [isEditProjectOpen, setEditProjectOpen] = useState(false);
  const [isEditCreativeOpen, setEditCreativeOpen] = useState(false);
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [creativeWorks, setCreativeWorks] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCreativeWorks: 0,
    totalMessages: 0,
    totalViews: 0,
  });
  
  // Loading states
  const [loading, setLoading] = useState({
    projects: false,
    creative: false,
    messages: false,
    stats: false,
  });
  
  // Edit states
  const [editingProject, setEditingProject] = useState(null);
  const [editingCreative, setEditingCreative] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState(null);

  // Show notification helper
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Load data functions
  const loadProjects = async () => {
    setLoading(prev => ({ ...prev, projects: true }));
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (error) {
      showNotification('Failed to load projects', 'error');
      console.error('Error loading projects:', error);
    } finally {
      setLoading(prev => ({ ...prev, projects: false }));
    }
  };

  const loadCreativeWorks = async () => {
    setLoading(prev => ({ ...prev, creative: true }));
    try {
      const data = await apiService.getCreativeWorks();
      setCreativeWorks(data);
    } catch (error) {
      showNotification('Failed to load creative works', 'error');
      console.error('Error loading creative works:', error);
    } finally {
      setLoading(prev => ({ ...prev, creative: false }));
    }
  };

  const loadContactMessages = async () => {
    setLoading(prev => ({ ...prev, messages: true }));
    try {
      const data = await apiService.getContactMessages();
      setContactMessages(data);
    } catch (error) {
      showNotification('Failed to load contact messages', 'error');
      console.error('Error loading contact messages:', error);
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  const loadStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadProjects();
    loadCreativeWorks();
    loadContactMessages();
    loadStats();
  }, []);

  // Menu handlers
  const handleMenuToggle = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const handleMenuAction = async (action, itemId, itemType) => {
    setOpenMenu(null);
    
    try {
      if (action === 'edit') {
        if (itemType === 'project') {
          const project = projects.find(p => p._id === itemId);
          setEditingProject(project);
          setEditProjectOpen(true);
        } else if (itemType === 'creative') {
          const creative = creativeWorks.find(c => c._id === itemId);
          setEditingCreative(creative);
          setEditCreativeOpen(true);
        }
      } else if (action === 'delete') {
        if (window.confirm('Are you sure you want to delete this item?')) {
          if (itemType === 'project') {
            await apiService.deleteProject(itemId);
            showNotification('Project deleted successfully', 'success');
            loadProjects();
          } else if (itemType === 'creative') {
            await apiService.deleteCreativeWork(itemId);
            showNotification('Creative work deleted successfully', 'success');
            loadCreativeWorks();
          }
        }
      }
    } catch (error) {
      showNotification(`Failed to ${action} item`, 'error');
      console.error(`Error ${action}ing item:`, error);
    }
  };

  // Form handlers
  const handleAddProject = async (formData) => {
    try {
      await apiService.createProject(formData);
      showNotification('Project created successfully', 'success');
      setAddProjectOpen(false);
      loadProjects();
      loadStats();
    } catch (error) {
      showNotification('Failed to create project', 'error');
      throw error;
    }
  };

  const handleEditProject = async (formData) => {
    try {
      await apiService.updateProject(editingProject._id, formData);
      showNotification('Project updated successfully', 'success');
      setEditProjectOpen(false);
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      showNotification('Failed to update project', 'error');
      throw error;
    }
  };

  const handleAddCreative = async (formData) => {
    try {
      await apiService.createCreativeWork(formData);
      showNotification('Creative work created successfully', 'success');
      setAddCreativeOpen(false);
      loadCreativeWorks();
      loadStats();
    } catch (error) {
      showNotification('Failed to create creative work', 'error');
      throw error;
    }
  };

  const handleEditCreative = async (formData) => {
    try {
      await apiService.updateCreativeWork(editingCreative._id, formData);
      showNotification('Creative work updated successfully', 'success');
      setEditCreativeOpen(false);
      setEditingCreative(null);
      loadCreativeWorks();
    } catch (error) {
      showNotification('Failed to update creative work', 'error');
      throw error;
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await apiService.deleteContactMessage(messageId);
      showNotification('Message deleted successfully', 'success');
      loadContactMessages();
      loadStats();
    } catch (error) {
      showNotification('Failed to delete message', 'error');
      console.error('Error deleting message:', error);
    }
  };

  const ActionMenu = ({ itemId, itemName, itemType }) => (
    <div className={styles.actionMenuContainer}>
      <button 
        className={styles.menuToggle}
        onClick={() => handleMenuToggle(itemId)}
      >
        ⋯
      </button>
      {openMenu === itemId && (
        <div className={styles.actionMenu}>
          <button 
            className={styles.menuItem}
            onClick={() => handleMenuAction('edit', itemId, itemType)}
          >
            Edit
          </button>
          <button 
            className={styles.menuItem}
            onClick={() => handleMenuAction('delete', itemId, itemType)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  const renderOverview = () => (
    <section className={styles.section}>
      <h2>Overview</h2>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Projects</h3>
          <p>{loading.stats ? '...' : stats.totalProjects}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Creative Works</h3>
          <p>{loading.stats ? '...' : stats.totalCreativeWorks}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Views</h3>
          <p>{loading.stats ? '...' : stats.totalViews}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Messages</h3>
          <p>{loading.stats ? '...' : stats.totalMessages}</p>
        </div>
      </div>
    </section>
  );

  const renderProjects = () => (
    <section className={styles.section}>
      <h2>Manage Projects</h2>
      <div className={styles.actionBar}>
        <button className={styles.addButton} onClick={() => setAddProjectOpen(true)}>Add New Project</button>
      </div>
      <div className={styles.tableContainer}>
        {loading.projects ? (
          <div className={styles.loading}>Loading projects...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Technologies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.noData}>No projects found</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.title}</td>
                    <td>{project.technologies}</td>
                    <td><span className={styles.statusActive}>Active</span></td>
                    <td>
                      <ActionMenu 
                        itemId={project._id} 
                        itemName={project.title} 
                        itemType="project"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={isAddProjectOpen} onClose={() => setAddProjectOpen(false)}>
        <h2 style={{marginTop:0}}>Add New Project</h2>
        <EditProjectForm onSubmit={handleAddProject} onCancel={() => setAddProjectOpen(false)} />
      </Modal>
      <Modal isOpen={isEditProjectOpen} onClose={() => {
        setEditProjectOpen(false);
        setEditingProject(null);
      }}>
        <h2 style={{marginTop:0}}>Edit Project</h2>
        <EditProjectForm 
          project={editingProject}
          onSubmit={handleEditProject} 
          onCancel={() => {
            setEditProjectOpen(false);
            setEditingProject(null);
          }}
          isEditing={true}
        />
      </Modal>
    </section>
  );

  const renderCreative = () => (
    <section className={styles.section}>
      <h2>Manage Creative Works</h2>
      <div className={styles.actionBar}>
        <button className={styles.addButton} onClick={() => setAddCreativeOpen(true)}>Add New Creative Work</button>
      </div>
      <div className={styles.tableContainer}>
        {loading.creative ? (
          <div className={styles.loading}>Loading creative works...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Mediums</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {creativeWorks.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.noData}>No creative works found</td>
                </tr>
              ) : (
                creativeWorks.map((creative) => (
                  <tr key={creative._id}>
                    <td>{creative.title}</td>
                    <td>{creative.mediums}</td>
                    <td><span className={styles.statusActive}>Active</span></td>
                    <td>
                      <ActionMenu 
                        itemId={creative._id} 
                        itemName={creative.title} 
                        itemType="creative"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <Modal isOpen={isAddCreativeOpen} onClose={() => setAddCreativeOpen(false)}>
        <h2 style={{marginTop:0}}>Add New Creative Work</h2>
        <EditCreativeForm onSubmit={handleAddCreative} onCancel={() => setAddCreativeOpen(false)} />
      </Modal>
      <Modal isOpen={isEditCreativeOpen} onClose={() => {
        setEditCreativeOpen(false);
        setEditingCreative(null);
      }}>
        <h2 style={{marginTop:0}}>Edit Creative Work</h2>
        <EditCreativeForm 
          creative={editingCreative}
          onSubmit={handleEditCreative} 
          onCancel={() => {
            setEditCreativeOpen(false);
            setEditingCreative(null);
          }}
          isEditing={true}
        />
      </Modal>
    </section>
  );

  const renderMessages = () => (
    <section className={styles.section}>
      <h2>Contact Messages</h2>
      <div className={styles.tableContainer}>
        {loading.messages ? (
          <div className={styles.loading}>Loading messages...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactMessages.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.noData}>No messages found</td>
                </tr>
              ) : (
                contactMessages.map((message) => (
                  <tr key={message._id}>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td className={styles.messageCell}>
                      {message.message.length > 50 
                        ? `${message.message.substring(0, 50)}...` 
                        : message.message
                      }
                    </td>
                    <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteMessage(message._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className={styles.section}>
      <h2>Settings</h2>
      <div className={styles.settingsGrid}>
        <div className={styles.settingCard}>
          <h3>Profile Settings</h3>
          <p>Update your admin profile information</p>
          <button className={styles.actionButton}>Edit Profile</button>
        </div>
        <div className={styles.settingCard}>
          <h3>Website Settings</h3>
          <p>Manage website configuration and preferences</p>
          <button className={styles.actionButton}>Configure</button>
        </div>
        <div className={styles.settingCard}>
          <h3>Security</h3>
          <p>Change password and security settings</p>
          <button className={styles.actionButton}>Security Settings</button>
        </div>
      </div>
    </section>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'projects':
        return renderProjects();
      case 'creative':
        return renderCreative();
      case 'messages':
        return renderMessages();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <button
          className={styles.hamburger}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1>Admin Dashboard</h1>
        <div className={styles.userInfo}>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>
      <div className={styles.content}>
        {sidebarOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          />
        )}
        <div
          className={
            styles.sidebar +
            (sidebarOpen ? ' ' + styles.sidebarOpen : '')
          }
        >
          <nav>
            <ul>
              <li>
                <button
                  className={`${styles.navButton} ${activeSection === 'overview' ? styles.active : ''}`}
                  onClick={() => {
                    setActiveSection('overview');
                    setSidebarOpen(false);
                  }}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  className={`${styles.navButton} ${activeSection === 'projects' ? styles.active : ''}`}
                  onClick={() => {
                    setActiveSection('projects');
                    setSidebarOpen(false);
                  }}
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  className={`${styles.navButton} ${activeSection === 'creative' ? styles.active : ''}`}
                  onClick={() => {
                    setActiveSection('creative');
                    setSidebarOpen(false);
                  }}
                >
                  Creative Works
                </button>
              </li>
              <li>
                <button
                  className={`${styles.navButton} ${activeSection === 'messages' ? styles.active : ''}`}
                  onClick={() => {
                    setActiveSection('messages');
                    setSidebarOpen(false);
                  }}
                >
                  Messages
                </button>
              </li>
              <li>
                <button
                  className={`${styles.navButton} ${activeSection === 'settings' ? styles.active : ''}`}
                  onClick={() => {
                    setActiveSection('settings');
                    setSidebarOpen(false);
                  }}
                >
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <main className={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
      
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Dashboard; 