import React, { useRef, useState } from 'react';
import styles from './AddProjectForm.module.css';

const AddCreativeForm = ({ onSubmit, onCancel }) => {
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
  const fileInputRef = useRef();

  // Valid creative work types from backend validation
  const validTypes = ['digital-art', 'branding', 'photography', 'illustration', 'ui-design', '3d-art'];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.description || !form.image) return;
    onSubmit(form);
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
          required
        />
        {preview && (
          <img src={preview} alt="Preview" className={styles.preview} />
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
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.submitButton}>Add Creative Work</button>
      </div>
    </form>
  );
};

export default AddCreativeForm; 