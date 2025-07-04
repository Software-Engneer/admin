import React, { useRef, useState, useEffect } from 'react';
import styles from './AddProjectForm.module.css';
import config from '../config';

const EditCreativeForm = ({ creative, onSubmit, onCancel, isEditing = false }) => {
  const [form, setForm] = useState({
    title: '',
    type: '',
    description: '',
    technologies: '',
    year: new Date().getFullYear(),
    featured: false,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  // Valid creative work types from backend validation
  const validTypes = ['digital-art', 'branding', 'photography', 'illustration', 'ui-design', '3d-art'];

  // Initialize form with creative data if editing
  useEffect(() => {
    if (creative && isEditing) {
      setForm({
        title: creative.title || '',
        type: creative.type || '',
        description: creative.description || '',
        technologies: Array.isArray(creative.technologies) ? creative.technologies.join(', ') : (creative.technologies || ''),
        year: creative.year || new Date().getFullYear(),
        featured: creative.featured || false,
        image: null,
      });
      if (creative.images && creative.images.length > 0) {
        // Check if it's a base64 image, URL, or local path
        const imageUrl = creative.images[0].startsWith('data:') 
          ? creative.images[0] 
          : creative.images[0].startsWith('http') 
            ? creative.images[0] 
            : `${config.UPLOAD_URL}/uploads${creative.images[0]}`;
        setPreview(imageUrl);
      }
    }
  }, [creative, isEditing]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
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
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.description) return;
    
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
        <label className={styles.label} htmlFor="image">Creative Image</label>
        <input
          className={styles.input}
          type="file"
          id="image"
          name="image"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleChange}
          required={!isEditing} // Only required for new creative works
        />
        {preview && (
          <img src={preview} alt="Preview" className={styles.preview} />
        )}
        {isEditing && !form.image && creative?.images && creative.images.length > 0 && (
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
        <label className={styles.label} htmlFor="type">Type</label>
        <select
          className={styles.input}
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="">Select a type</option>
          {validTypes.map(type => (
            <option key={type} value={type}>
              {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
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
          placeholder="e.g. Photoshop, Illustrator, Digital Art"
        />
      </div>
      <div>
        <label className={styles.label} htmlFor="year">Year</label>
        <input
          className={styles.input}
          type="number"
          id="year"
          name="year"
          value={form.year}
          onChange={handleChange}
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>
      <div>
        <label className={styles.label}>
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Featured Work
        </label>
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
          {isLoading ? 'Saving...' : (isEditing ? 'Update Creative Work' : 'Add Creative Work')}
        </button>
      </div>
    </form>
  );
};

export default EditCreativeForm; 