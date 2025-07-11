import React, { useRef, useState, useEffect } from 'react';
import styles from './AddProjectForm.module.css';
import config from '../config';

const EditProjectForm = ({ project, onSubmit, onCancel, isEditing = false }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    projectLink: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  // Initialize form with project data if editing
  useEffect(() => {
    if (project && isEditing) {
      setForm({
        title: project.title || '',
        description: project.description || '',
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || ''),
        githubLink: project.githubLink || '',
        projectLink: project.projectLink || '',
        image: null,
      });
      if (project.image) {
        // Check if it's a base64 image, URL, or local path
        const imageUrl = project.image.startsWith('data:') 
          ? project.image 
          : project.image.startsWith('http') 
            ? project.image 
            : `${config.UPLOAD_URL}/images/${project.image}`;
        setPreview(imageUrl);
      }
    }
  }, [project, isEditing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.technologies) return;
    
    setIsLoading(true);
    try {
      await onSubmit(form);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div>
        <label className={styles.label} htmlFor="image">Project Image</label>
        <input
          className={styles.input}
          type="file"
          id="image"
          name="image"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleChange}
          required={!isEditing} // Only required for new projects
        />
        {preview && (
          <img src={preview} alt="Preview" className={styles.preview} />
        )}
        {isEditing && !form.image && project?.image && (
          <p className={styles.helpText}>Current image will be kept if no new image is selected</p>
        )}
      </div>
      <div>
        <label className={styles.label} htmlFor="title">Title</label>
        <input
          className={styles.input}
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea
          className={styles.textarea}
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="technologies">Technologies Used</label>
        <input
          className={styles.input}
          type="text"
          id="technologies"
          name="technologies"
          value={form.technologies}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, MongoDB"
          required
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="githubLink">Project Link (GitHub/Live Demo)</label>
        <input
          className={styles.input}
          type="url"
          id="githubLink"
          name="githubLink"
          value={form.githubLink}
          onChange={handleChange}
          placeholder="https://github.com/username/project or https://demo-link.com"
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="projectLink">Project Link (Live Demo/Website)</label>
        <input
          className={styles.input}
          type="url"
          id="projectLink"
          name="projectLink"
          value={form.projectLink}
          onChange={handleChange}
          placeholder="https://demo-link.com"
        />
      </div>
      <div className={styles.buttonRow}>
        <button 
          type="button" 
          className={styles.cancelButton} 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (isEditing ? 'Update Project' : 'Add Project')}
        </button>
      </div>
    </form>
  );
};

export default EditProjectForm; 