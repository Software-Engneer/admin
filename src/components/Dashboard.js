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
  const [isReadMessageOpen, setReadMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [creativeWorks, setCreativeWorks] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [readMessages, setReadMessages] = useState(new Set());
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

  // Add status state to track status for each item
  const [itemStatuses, setItemStatuses] = useState({});

  // Show notification helper
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  // Load data functions
  const loadProjects = async () => {
    setLoading(prev => ({ ...prev, projects: true }));
    try {
      const data = await apiService.getProjects();
      console.log('Projects data received:', data);
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

  // Add useEffect for handling clicks outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu && !event.target.closest(`.${styles.actionMenuContainer}`)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

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

  const handleMenuAction = async (action, itemId, itemType, messageData = null) => {
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
          } else if (itemType === 'message') {
            await apiService.deleteContactMessage(itemId);
            showNotification('Message deleted successfully', 'success');
            loadContactMessages();
            loadStats();
          }
        }
      } else if (action === 'read' && itemType === 'message') {
        // Show full message in a modal and mark as read
        setSelectedMessage(messageData);
        setReadMessageOpen(true);
        setReadMessages(prev => new Set([...prev, itemId]));
        
        // Mark message as read in database
        try {
          await apiService.markMessageAsRead(itemId);
        } catch (error) {
          console.error('Failed to mark message as read:', error);
        }
      } else if (action === 'reply' && itemType === 'message') {
        // Open email client with pre-filled email
        const email = messageData?.email || '';
        const subject = `Re: Message from ${messageData?.name}`;
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
        window.open(mailtoLink, '_blank');
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

  // Update status toggle handler to use local state only
  const handleStatusToggle = (itemId, itemType) => {
    const currentStatus = itemStatuses[itemId] || 'Active';
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    setItemStatuses(prev => ({
      ...prev,
      [itemId]: newStatus
    }));
    
    showNotification(`Status updated to ${newStatus}`, 'success');
  };

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

  const renderTableSection = ({
    title,
    addButtonLabel,
    onAddClick,
    loading,
    items,
    columns,
    itemType,
    getRowData,
    isAddOpen,
    setAddOpen,
    isEditOpen,
    setEditOpen,
    editingItem,
    setEditingItem,
    EditFormComponent,
    handleAdd,
    handleEdit,
  }) => {
    // Defensive: ensure items is always an array
    items = Array.isArray(items) ? items : [];
    return (
      <section className={styles.section}>
        <h2>{title}</h2>
        <div className={styles.actionBar}>
          <button className={styles.addButton} onClick={onAddClick}>{addButtonLabel}</button>
        </div>
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loading}>Loading {title.toLowerCase()}...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map((col) => <th key={col}>{col}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className={styles.noData}>No {title.toLowerCase()} found</td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const rowData = getRowData(item);
                    const isLast = idx === items.length - 1;
                    return (
                      <tr key={item._id || item.id}>
                        {rowData.map((cell, idx) => <td key={idx}>{cell}</td>)}
                        <td>
                          <ActionMenu 
                            itemId={item._id || item.id} 
                            itemName={item.title} 
                            itemType={itemType}
                            upwards={isLast}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
        <Modal isOpen={isAddOpen} onClose={() => setAddOpen(false)}>
          <h2 style={{marginTop:0}}>{addButtonLabel}</h2>
          <EditFormComponent onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />
        </Modal>
        <Modal isOpen={isEditOpen} onClose={() => {
          setEditOpen(false);
          setEditingItem(null);
        }}>
          <h2 style={{marginTop:0}}>Edit {title.slice(0, -1)}</h2>
          <EditFormComponent 
            {...{ [itemType]: editingItem }}
            onSubmit={handleEdit} 
            onCancel={() => {
              setEditOpen(false);
              setEditingItem(null);
            }}
            isEditing={true}
          />
        </Modal>
      </section>
    );
  };

  const renderProjects = () => {
    console.log('Current projects state:', projects);
    console.log('Projects type:', typeof projects);
    console.log('Projects length:', projects?.length);
    
    if (!Array.isArray(projects)) {
      console.error('Projects is not an array:', projects);
      return (
        <section className={styles.section}>
          <h2>Projects</h2>
          <div className={styles.loading}>Error: Invalid projects data</div>
        </section>
      );
    }
    
    return renderTableSection({
      title: 'Projects',
      addButtonLabel: 'Add New Project',
      onAddClick: () => setAddProjectOpen(true),
      loading: loading.projects,
      items: projects,
      columns: ['Title', 'Technologies', 'Status'],
      itemType: 'project',
      getRowData: (project) => {
        console.log('Processing project:', project);
        console.log('Project title:', project?.title);
        console.log('Project technologies:', project?.technologies);
        console.log('Project id:', project?.id);
        
        const title = project?.title || project?.name || 'No Title';
        const technologies = Array.isArray(project?.technologies) 
          ? project.technologies.join(', ') 
          : (project?.technologies || project?.tech || 'No Technologies');
        
        console.log('Final title:', title);
        console.log('Final technologies:', technologies);
        
        return [
          title,
          technologies,
          <button 
            className={itemStatuses[project?.id] === 'Inactive' ? styles.statusInactive : styles.statusActive}
            onClick={() => handleStatusToggle(project?.id, 'project')}
          >
            {itemStatuses[project?.id] || 'Active'}
          </button>,
        ];
      },
      isAddOpen: isAddProjectOpen,
      setAddOpen: setAddProjectOpen,
      isEditOpen: isEditProjectOpen,
      setEditOpen: setEditProjectOpen,
      editingItem: editingProject,
      setEditingItem: setEditingProject,
      EditFormComponent: EditProjectForm,
      handleAdd: handleAddProject,
      handleEdit: handleEditProject,
    });
  };

  const renderCreative = () => renderTableSection({
    title: 'Creative Works',
    addButtonLabel: 'Add New Creative Work',
    onAddClick: () => setAddCreativeOpen(true),
    loading: loading.creative,
    items: creativeWorks,
    columns: ['Title', 'Type', 'Technologies', 'Status'],
    itemType: 'creative',
    getRowData: (creative) => [
      creative.title || 'Untitled',
      creative.type ? creative.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'N/A',
      Array.isArray(creative.technologies) ? creative.technologies.join(', ') : (creative.technologies || 'N/A'),
      <button 
        className={itemStatuses[creative.id] === 'Inactive' ? styles.statusInactive : styles.statusActive}
        onClick={() => handleStatusToggle(creative.id, 'creative')}
      >
        {itemStatuses[creative.id] || 'Active'}
      </button>,
    ],
    isAddOpen: isAddCreativeOpen,
    setAddOpen: setAddCreativeOpen,
    isEditOpen: isEditCreativeOpen,
    setEditOpen: setEditCreativeOpen,
    editingItem: editingCreative,
    setEditingItem: setEditingCreative,
    EditFormComponent: EditCreativeForm,
    handleAdd: handleAddCreative,
    handleEdit: handleEditCreative,
  });

  const renderMessages = () => {
    // Defensive: ensure contactMessages is always an array
    const safeMessages = Array.isArray(contactMessages) ? contactMessages : [];
    return (
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
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeMessages.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={styles.noData}>No messages found</td>
                  </tr>
                ) : (
                  safeMessages.map((message, idx) => {
                    const isLast = idx === safeMessages.length - 1;
                    const messageId = message.id || message._id;
                    const isRead = message.read || readMessages.has(messageId);
                    // Combine firstName and lastName, fallback to old name field if new fields don't exist
                    const fullName = message.firstName && message.lastName 
                      ? `${message.firstName} ${message.lastName}`
                      : message.name || 'Unknown';
                    
                    // Create message preview (first 30 characters with ellipsis)
                    const messagePreview = message.message && message.message.length > 30 
                      ? `${message.message.substring(0, 30)}...`
                      : message.message || 'No message';
                    
                    return (
                      <tr key={messageId} className={isRead ? styles.readMessage : styles.unreadMessage}>
                        <td>
                          <div className={styles.messageName}>
                            {fullName}
                            {!isRead && <span className={styles.unreadDot}></span>}
                          </div>
                        </td>
                        <td>{message.email}</td>
                        <td>{message.phoneNumber || 'N/A'}</td>
                        <td className={styles.messageCell}>
                          <span className={styles.messagePreview} title={message.message}>
                            {messagePreview}
                          </span>
                        </td>
                        <td>{new Date(message.timestamp || message.createdAt).toLocaleDateString()}</td>
                        <td>
                          <ActionMenu 
                            itemId={messageId} 
                            itemName={fullName} 
                            itemType="message"
                            upwards={isLast}
                            messageData={message}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    );
  };

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

  const ActionMenu = ({ itemId, itemName, itemType, upwards, messageData = null }) => {
    const handleToggle = () => {
      console.log('Menu toggle clicked for:', itemId, 'Current openMenu:', openMenu);
      handleMenuToggle(itemId);
    };

    console.log('ActionMenu render - itemId:', itemId, 'openMenu:', openMenu, 'isOpen:', openMenu === itemId);

    const renderMenuItems = () => {
      if (itemType === 'message') {
        return (
          <>
            <button 
              className={styles.menuItem}
              onClick={() => handleMenuAction('read', itemId, itemType, messageData)}
            >
              Read
            </button>
            <button 
              className={styles.menuItem}
              onClick={() => handleMenuAction('reply', itemId, itemType, messageData)}
            >
              Reply
            </button>
            <button 
              className={styles.menuItem}
              onClick={() => handleMenuAction('delete', itemId, itemType, messageData)}
            >
              Delete
            </button>
          </>
        );
      } else {
        return (
          <>
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
          </>
        );
      }
    };

    return (
      <div className={styles.actionMenuContainer}>
        <button 
          className={styles.menuToggle}
          onClick={handleToggle}
        >
          ⋯
        </button>
        {openMenu === itemId && (
          <div 
            className={styles.actionMenu + (upwards ? ' ' + styles.upwards : '')}
          >
            {renderMenuItems()}
          </div>
        )}
      </div>
    );
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
                  {contactMessages.length > 0 && (
                    <span className={styles.messageBadge}>
                      {contactMessages.length - readMessages.size}
                    </span>
                  )}
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
      
      {/* Message Reading Modal */}
      <Modal isOpen={isReadMessageOpen} onClose={() => {
        setReadMessageOpen(false);
        setSelectedMessage(null);
      }}>
        {selectedMessage && (
          <div className={styles.messageModal}>
            <h2 style={{marginTop: 0, marginBottom: '1rem'}}>Message Details</h2>
            <div className={styles.messageInfo}>
              <p><strong>From:</strong> {selectedMessage.firstName && selectedMessage.lastName 
                ? `${selectedMessage.firstName} ${selectedMessage.lastName}`
                : selectedMessage.name || 'Unknown'}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              <p><strong>Phone:</strong> {selectedMessage.phoneNumber || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedMessage.timestamp || selectedMessage.createdAt).toLocaleString()}</p>
            </div>
            <div className={styles.messageContent}>
              <h3>Message:</h3>
              <p>{selectedMessage.message}</p>
            </div>
            <div className={styles.messageActions}>
              <button 
                className={styles.actionButton}
                onClick={() => {
                  const email = selectedMessage.email;
                  const fullName = selectedMessage.firstName && selectedMessage.lastName 
                    ? `${selectedMessage.firstName} ${selectedMessage.lastName}`
                    : selectedMessage.name || 'Unknown';
                  const subject = `Re: Message from ${fullName}`;
                  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
                  window.open(mailtoLink, '_blank');
                }}
              >
                Reply via Email
              </button>
              <button 
                className={styles.actionButtonDelete}
                onClick={() => {
                  handleDeleteMessage(selectedMessage.id || selectedMessage._id);
                  setReadMessageOpen(false);
                  setSelectedMessage(null);
                }}
              >
                Delete Message
              </button>
            </div>
          </div>
        )}
      </Modal>

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