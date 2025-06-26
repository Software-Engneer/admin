import React, { useRef, useState, useEffect } from 'react';
import styles from './AddProjectForm.module.css';
import config from '../config';

const EditCreativeForm = ({ creative, onSubmit, onCancel, isEditing = false }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    mediums: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  // Initialize form with creative data if editing
  useEffect(() => {
    if (creative && isEditing) {
      setForm({
        title: creative.title || '',
        description: creative.description || '',
        mediums: creative.mediums || '',
        image: null,
      });
      if (creative.image) {
        setPreview(`${config.UPLOAD_URL}/images/${creative.image}`);
      }
    }
  }, [creative, isEditing]);

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
    if (!form.title || !form.description || !form.mediums) return;
    
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
        {isEditing && !form.image && creative?.image && (
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
        <label className={styles.label} htmlFor="mediums">Mediums/Technologies Used</label>
        <input
          className={styles.input}
          type="text"
          id="mediums"
          name="mediums"
          value={form.mediums}
          onChange={handleChange}
          placeholder="e.g. Digital Art, Illustration, Photoshop"
          required
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
          {isLoading ? 'Saving...' : (isEditing ? 'Update Creative Work' : 'Add Creative Work')}
        </button>
      </div>
    </form>
  );
};

export default EditCreativeForm; 