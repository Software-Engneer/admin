# Admin Dashboard

A comprehensive admin dashboard for managing portfolio content including projects, creative works, and contact messages.

## Features

### 🔐 Authentication
- Secure login system
- Protected routes
- User session management

### 📊 Dashboard Overview
- Real-time statistics
- Total projects count
- Total creative works count
- Total contact messages
- Total views (placeholder for future implementation)

### 🚀 Project Management
- **Create**: Add new projects with title, description, technologies, and image
- **Read**: View all projects in a table format
- **Update**: Edit existing projects
- **Delete**: Remove projects with confirmation

### 🎨 Creative Works Management
- **Create**: Add new creative works with title, description, mediums, and image
- **Read**: View all creative works in a table format
- **Update**: Edit existing creative works
- **Delete**: Remove creative works with confirmation

### 📧 Contact Messages
- View all contact form submissions
- Delete messages
- Message preview with truncation for long messages

### 🔔 Notifications
- Success/error notifications for all operations
- Auto-dismissing notifications
- Manual close option

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Running API server (see API documentation)

### Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API URL:
   - Create a `.env` file in the admin directory
   - Add: `REACT_APP_API_URL=http://localhost:5000/api`
   - Or modify `src/config.js` directly

4. Start the development server:
```bash
npm start
```

The admin dashboard will be available at `http://localhost:3000`

### Configuration

The admin dashboard uses the following configuration:

- **API Base URL**: `http://localhost:5000/api` (default)
- **Upload URL**: `http://localhost:5000` (default)

You can override these by setting environment variables:
- `REACT_APP_API_URL`
- `REACT_APP_UPLOAD_URL`

## API Integration

The dashboard integrates with the following API endpoints:

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Creative Works
- `GET /api/creative` - Get all creative works
- `POST /api/creative` - Create new creative work
- `PUT /api/creative/:id` - Update creative work
- `DELETE /api/creative/:id` - Delete creative work

### Contact Messages
- `GET /api/contact` - Get all contact messages
- `DELETE /api/contact/:id` - Delete contact message

## File Upload

The dashboard supports image uploads for projects and creative works:
- Supported formats: JPG, PNG, GIF, WebP
- Images are uploaded to the server's `/public/images/` directory
- File size limit: 10MB (configurable on server)

## Usage

### Adding a New Project
1. Navigate to the "Projects" section
2. Click "Add New Project"
3. Fill in the form:
   - Upload an image
   - Enter title
   - Enter description
   - Enter technologies used
4. Click "Add Project"

### Editing a Project
1. Navigate to the "Projects" section
2. Click the menu (⋯) next to the project
3. Select "Edit"
4. Modify the form fields
5. Click "Update Project"

### Deleting a Project
1. Navigate to the "Projects" section
2. Click the menu (⋯) next to the project
3. Select "Delete"
4. Confirm the deletion

### Managing Creative Works
Follow the same process as projects, but use the "Creative Works" section.

### Viewing Contact Messages
1. Navigate to the "Messages" section
2. View all contact form submissions
3. Delete messages as needed

## Error Handling

The dashboard includes comprehensive error handling:
- Network errors are displayed as notifications
- Form validation prevents invalid submissions
- Loading states provide user feedback
- Confirmation dialogs for destructive actions

## Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Security

- All API requests include proper error handling
- File uploads are validated
- Authentication is required for all operations
- CSRF protection (handled by the API)

## Development

### Project Structure
```
src/
├── components/
│   ├── Dashboard.js          # Main dashboard component
│   ├── EditProjectForm.js    # Project form (create/edit)
│   ├── EditCreativeForm.js   # Creative work form (create/edit)
│   ├── Notification.js       # Notification component
│   ├── Modal.js              # Modal component
│   └── AuthContext.js        # Authentication context
├── services/
│   └── api.js                # API service
├── config.js                 # Configuration
└── ...
```

### Adding New Features

1. **New Content Type**: Add new routes and forms following the existing pattern
2. **New API Endpoints**: Update the API service with new methods
3. **New UI Components**: Create reusable components in the components directory

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check if the API server is running
   - Verify the API URL in config.js
   - Check CORS settings on the server

2. **Image Upload Fails**
   - Check file size (should be under 10MB)
   - Verify file format is supported
   - Check server upload directory permissions

3. **Authentication Issues**
   - Clear browser cache and cookies
   - Check if the API authentication is working
   - Verify login credentials

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` in your environment variables.

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include loading states for async operations
4. Test on different screen sizes
5. Update documentation for new features

## License

This project is part of the portfolio management system.
