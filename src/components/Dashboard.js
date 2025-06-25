import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from './Dashboard.module.css';
import Modal from './Modal';
import AddProjectForm from './AddProjectForm';
import AddCreativeForm from './AddCreativeForm';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [openMenu, setOpenMenu] = useState(null);
  const [isAddProjectOpen, setAddProjectOpen] = useState(false);
  const [isAddCreativeOpen, setAddCreativeOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const handleMenuAction = (action, itemId) => {
    console.log(`${action} action for item ${itemId}`);
    setOpenMenu(null);
  };

  const handleAddProject = (formData) => {
    // For now, just close the modal. You can add saving logic later.
    setAddProjectOpen(false);
    // Optionally, show a success message or update state.
  };

  const handleAddCreative = (formData) => {
    setAddCreativeOpen(false);
  };

  const ActionMenu = ({ itemId, itemName }) => (
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
            onClick={() => handleMenuAction('edit', itemId)}
          >
            Edit
          </button>
          <button 
            className={styles.menuItem}
            onClick={() => handleMenuAction('delete', itemId)}
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
          <p>12</p>
        </div>
        <div className={styles.statCard}>
          <h3>Creative Works</h3>
          <p>8</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Views</h3>
          <p>1,234</p>
        </div>
        <div className={styles.statCard}>
          <h3>Messages</h3>
          <p>5</p>
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
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>E-commerce Website</td>
              <td>Web Development</td>
              <td><span className={styles.statusActive}>Active</span></td>
              <td>
                <ActionMenu itemId="project-1" itemName="E-commerce Website" />
              </td>
            </tr>
            <tr>
              <td>Mobile App Design</td>
              <td>UI/UX Design</td>
              <td><span className={styles.statusActive}>Active</span></td>
              <td>
                <ActionMenu itemId="project-2" itemName="Mobile App Design" />
              </td>
            </tr>
            <tr>
              <td>Portfolio Website</td>
              <td>Web Development</td>
              <td><span className={styles.statusActive}>Active</span></td>
              <td>
                <ActionMenu itemId="project-3" itemName="Portfolio Website" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal isOpen={isAddProjectOpen} onClose={() => setAddProjectOpen(false)}>
        <h2 style={{marginTop:0}}>Add New Project</h2>
        <AddProjectForm onSubmit={handleAddProject} onCancel={() => setAddProjectOpen(false)} />
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
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Digital Art Collection</td>
              <td>Digital Art</td>
              <td><span className={styles.statusActive}>Active</span></td>
              <td>
                <ActionMenu itemId="creative-1" itemName="Digital Art Collection" />
              </td>
            </tr>
            <tr>
              <td>Brand Identity Design</td>
              <td>Branding</td>
              <td><span className={styles.statusActive}>Active</span></td>
              <td>
                <ActionMenu itemId="creative-2" itemName="Brand Identity Design" />
              </td>
            </tr>
            <tr>
              <td>Illustration Series</td>
              <td>Illustration</td>
              <td><span className={styles.statusActive}>Active</span></td>
              <td>
                <ActionMenu itemId="creative-3" itemName="Illustration Series" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal isOpen={isAddCreativeOpen} onClose={() => setAddCreativeOpen(false)}>
        <h2 style={{marginTop:0}}>Add New Creative Work</h2>
        <AddCreativeForm onSubmit={handleAddCreative} onCancel={() => setAddCreativeOpen(false)} />
      </Modal>
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
    </div>
  );
};

export default Dashboard; 