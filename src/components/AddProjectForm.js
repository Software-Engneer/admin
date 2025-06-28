import React, { useRef, useState } from 'react';
import styles from './AddProjectForm.module.css';

const AddProjectForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    projectLink: '',
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
    if (!form.title || !form.description || !form.technologies || !form.image) return;
    onSubmit(form);
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
          placeholder="https://demo-link.com or https://website-link.com"
        />
      </div>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.submitButton}>Add Project</button>
      </div>
    </form>
  );
};

export default AddProjectForm; 