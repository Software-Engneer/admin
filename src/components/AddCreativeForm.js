import React, { useRef, useState } from 'react';
import styles from './AddProjectForm.module.css';

const AddCreativeForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    mediums: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.mediums || !form.image) return;
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
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.submitButton}>Add Creative Work</button>
      </div>
    </form>
  );
};

export default AddCreativeForm; 