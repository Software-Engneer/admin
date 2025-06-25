import React, { useRef, useState } from 'react';

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  width: '100%',
  maxWidth: '400px',
};

const labelStyles = {
  fontWeight: 500,
  marginBottom: '0.3rem',
};

const inputStyles = {
  padding: '0.8rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
};

const textareaStyles = {
  ...inputStyles,
  minHeight: '80px',
  resize: 'vertical',
};

const buttonStyles = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  padding: '1rem',
  borderRadius: '6px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '1rem',
};

const AddProjectForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: '',
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
    <form style={formStyles} onSubmit={handleSubmit}>
      <div>
        <label style={labelStyles} htmlFor="image">Project Image</label>
        <input
          style={inputStyles}
          type="file"
          id="image"
          name="image"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleChange}
          required
        />
        {preview && (
          <img src={preview} alt="Preview" style={{ marginTop: '0.5rem', maxWidth: '100%', borderRadius: '6px' }} />
        )}
      </div>
      <div>
        <label style={labelStyles} htmlFor="title">Title</label>
        <input
          style={inputStyles}
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label style={labelStyles} htmlFor="description">Description</label>
        <textarea
          style={textareaStyles}
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label style={labelStyles} htmlFor="technologies">Technologies Used</label>
        <input
          style={inputStyles}
          type="text"
          id="technologies"
          name="technologies"
          value={form.technologies}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, MongoDB"
          required
        />
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" style={{ ...buttonStyles, background: '#ccc', color: '#333' }} onClick={onCancel}>Cancel</button>
        <button type="submit" style={buttonStyles}>Add Project</button>
      </div>
    </form>
  );
};

export default AddProjectForm; 